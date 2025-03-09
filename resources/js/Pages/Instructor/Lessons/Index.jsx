import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    Edit,
    MoreHorizontal,
    Plus,
    Trash,
    Video,
} from 'lucide-react';
import { useState } from 'react';

export default function Index({ course, lessons }) {
    const [reordering, setReordering] = useState(false);
    const [orderedLessons, setOrderedLessons] = useState([...lessons]);

    const handleDelete = (lessonId) => {
        if (confirm('Are you sure you want to delete this lesson?')) {
            router.delete(route('instructor.lessons.destroy', lessonId), {
                onSuccess: () => {
                    // toast({
                    //     title: 'Lesson deleted',
                    //     description:
                    //         'The lesson has been deleted successfully.',
                    // });
                },
            });
        }
    };

    const handleReorder = () => {
        if (reordering) {
            // Save the new order
            router.post(
                route('instructor.courses.lessons.reorder', course.id),
                {
                    lessons: orderedLessons.map((lesson, index) => ({
                        id: lesson.id,
                        order: index + 1,
                    })),
                },
                {
                    onSuccess: () => {
                        toast({
                            title: 'Lessons reordered',
                            description:
                                'The lesson order has been updated successfully.',
                        });
                        setReordering(false);
                    },
                },
            );
        } else {
            setReordering(true);
        }
    };

    const moveLesson = (index, direction) => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === orderedLessons.length - 1)
        ) {
            return;
        }

        const newLessons = [...orderedLessons];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        [newLessons[index], newLessons[newIndex]] = [
            newLessons[newIndex],
            newLessons[index],
        ];
        setOrderedLessons(newLessons);
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Lessons - ${course.title}`} />

            <div className="space-y-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <Button variant="ghost" asChild className="mr-4">
                            <Link
                                href={route(
                                    'instructor.courses.show',
                                    course.id,
                                )}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to
                                Course
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-semibold">
                            Lessons for {course.title}
                        </h1>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline" onClick={handleReorder}>
                            {reordering ? 'Save Order' : 'Reorder Lessons'}
                        </Button>
                        <Button asChild>
                            <Link
                                href={route(
                                    'instructor.courses.lessons.create',
                                    course.id,
                                )}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Lesson
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Course Lessons</CardTitle>
                        <CardDescription>
                            Manage the lessons for this course
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {orderedLessons.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {reordering && (
                                            <TableHead>Order</TableHead>
                                        )}
                                        <TableHead>Title</TableHead>
                                        <TableHead>Section</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderedLessons.map((lesson, index) => (
                                        <TableRow key={lesson.id}>
                                            {reordering && (
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                moveLesson(
                                                                    index,
                                                                    'up',
                                                                )
                                                            }
                                                            disabled={
                                                                index === 0
                                                            }
                                                        >
                                                            ↑
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                moveLesson(
                                                                    index,
                                                                    'down',
                                                                )
                                                            }
                                                            disabled={
                                                                index ===
                                                                orderedLessons.length -
                                                                    1
                                                            }
                                                        >
                                                            ↓
                                                        </Button>
                                                        <span>{index + 1}</span>
                                                    </div>
                                                </TableCell>
                                            )}
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={route(
                                                        'instructor.lessons.show',
                                                        lesson.id,
                                                    )}
                                                    className="hover:underline"
                                                >
                                                    {lesson.title}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                {lesson.section || 'Default'}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                                                    {lesson.duration
                                                        ? `${lesson.duration} min`
                                                        : 'N/A'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        lesson.is_published
                                                            ? 'success'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {lesson.is_published
                                                        ? 'Published'
                                                        : 'Draft'}
                                                </Badge>
                                                {lesson.is_free && (
                                                    <Badge
                                                        variant="outline"
                                                        className="ml-2"
                                                    >
                                                        Free
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={route(
                                                                    'instructor.lessons.edit',
                                                                    lesson.id,
                                                                )}
                                                            >
                                                                <Edit className="mr-2 h-4 w-4" />{' '}
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={route(
                                                                    'instructor.lessons.show',
                                                                    lesson.id,
                                                                )}
                                                            >
                                                                <Video className="mr-2 h-4 w-4" />{' '}
                                                                View
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleDelete(
                                                                    lesson.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash className="mr-2 h-4 w-4" />{' '}
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Video className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-medium">
                                    No lessons yet
                                </h3>
                                <p className="mb-4 text-center text-muted-foreground">
                                    You haven't added any lessons to this course
                                    yet.
                                </p>
                                <Button asChild>
                                    <Link
                                        href={route(
                                            'instructor.courses.lessons.create',
                                            course.id,
                                        )}
                                    >
                                        Add Your First Lesson
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
