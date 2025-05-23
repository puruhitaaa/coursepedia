<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Category;
use App\Models\Enrollment;
use App\Models\PromoCodes;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    /**
     * Display a paginated listing of published courses.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $category = $request->input('category');
        $level = $request->input('level');
        $search = $request->input('search');
        $sort = $request->input('sort', 'latest');
        $instructor = $request->input('instructor');
        $page = $request->input('page', 1);
        $perPage = 9;

        $query = Course::where('is_published', true)
            ->where('is_approved', true)
            ->with(['category', 'user:id,name,profile_photo_path'])
            ->withCount(['lessons', 'enrollments', 'reviews']);

        if ($category) {
            $query->where('category_id', $category);
        }

        if ($level) {
            $query->where('level', $level);
        }

        if ($instructor) {
            $query->where('user_id', $instructor);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%");
            });
        }

        switch ($sort) {
            case 'popular':
                $query->orderByDesc('enrollments_count');
                break;
            case 'rating':
                $query->orderByRaw('(SELECT AVG(rating) FROM reviews WHERE reviews.course_id = courses.id AND reviews.is_approved = true) DESC NULLS LAST');
                break;
            case 'price_low':
                $query->orderBy('price');
                break;
            case 'price_high':
                $query->orderByDesc('price');
                break;
            case 'latest':
            default:
                $query->orderByDesc('created_at');
        }

        $courses = $query->paginate($perPage);

        $courses->each(function ($course) use ($request) {
            $course->average_rating = $course->reviews()
                ->where('is_approved', true)
                ->avg('rating') ?? 0;

            if ($request->user()) {
                $course->is_enrolled = $course->enrollments()
                    ->where('user_id', $request->user()->id)
                    ->exists();
                
                $course->is_wishlisted = $request->user()
                    ->wishlistedCourses()
                    ->where('course_id', $course->id)
                    ->exists();
            } else {
                $course->is_enrolled = false;
                $course->is_wishlisted = false;
            }
        });

        $coursePagination = $courses->toArray();
        $isNextPageExists = $coursePagination['current_page'] < $coursePagination['last_page'];

        $categories = Category::orderBy('name')->get();
        $levels = Course::distinct()->pluck('level')->filter()->values();

        return Inertia::render('Courses/Index', [
            'courses' => Inertia::merge($courses->items()),
            'page' => $page,
            'isNextPageExists' => $isNextPageExists,
            'filters' => [
                'category' => $category,
                'level' => $level,
                'search' => $search,
                'sort' => $sort,
                'instructor' => $instructor,
            ],
            'categories' => $categories,
            'levels' => $levels,
        ]);
    }

    /**
     * Display the specified course.
     *
     * @param  string  $slug
     * @return \Inertia\Response
     */
    public function show($slug, Request $request)
    {
        $course = Course::where('slug', $slug)
            ->where('is_published', true)
            ->where('is_approved', true)
            ->with([
                'category',
                'user:id,name,profile_photo_path,bio',
                'lessons' => function ($query) {
                    $query->select('id', 'course_id', 'title', 'description', 'duration', 'order')
                          ->orderBy('order');
                }
            ])
            ->withCount(['lessons', 'enrollments', 'reviews'])
            ->firstOrFail();

        $course->append('average_rating');

        if ($request->user()) {
            $course->is_enrolled = $course->enrollments()
                ->where('user_id', $request->user()->id)
                ->exists();
        } else {
            $course->is_enrolled = false;
        }

        $reviews = $course->reviews()
            ->where('is_approved', true)
            ->with('user:id,name,profile_photo_path')
            ->latest()
            ->take(5)
            ->get();

        $similarCourses = Course::where('category_id', $course->category_id)
            ->where('id', '!=', $course->id)
            ->where('is_published', true)
            ->where('is_approved', true)
            ->inRandomOrder()
            ->take(3)
            ->get();

        $activeTab = $request->input('tab', 'overview');

        return Inertia::render('Courses/Show', [
            'course' => $course,
            'reviews' => $reviews,
            'similarCourses' => $similarCourses,
            'activeTab' => $activeTab,
        ]);
    }

        /**
     * Show the checkout page for a course
     *
     * @param  \App\Models\Course  $course
     * @return \Inertia\Response
     */
    public function checkout(Course $course, Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login', [
                'redirect_to' => route('payment.checkout', $course->id)
            ]);
        }

        if ($user->id === $course->user_id) {
            return redirect()->route('instructor.courses.show', $course->id)
                ->with('error', 'You cannot enroll in your own course');
        }

        $existingEnrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        if ($existingEnrollment) {
            return redirect()->route('student.courses.show', $course->slug)
                ->with('info', 'You are already enrolled in this course');
        }

        $promoCodes = PromoCodes::where('is_active', true)
            ->whereDate('start_date', '<=', now())
            ->where(function ($query) {
                $query->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', now());
            })
            ->where(function ($query) use ($course) {
                $query->where('min_cart_value', '<=', $course->price)
                    ->orWhereNull('min_cart_value');
            })
            ->where(function ($query) {
                $query->whereNull('max_uses')
                    ->orWhere('used_count', '<', \Illuminate\Support\Facades\DB::raw('max_uses'));
            })
            ->get();

        return \Inertia\Inertia::render('Courses/Checkout', [
            'course' => $course,
            'promoCodes' => $promoCodes,
            'tax' => config('payment.tax_percentage', 0),
        ]);
    }
}
