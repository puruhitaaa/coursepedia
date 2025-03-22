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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/Components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatCurrency } from '@/lib/utils';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { debounce } from 'lodash';
import {
    BookOpen,
    CheckCircle,
    Edit,
    Eye,
    PlusCircle,
    Search,
    Star,
    Trash,
    XCircle,
} from 'lucide-react';
import { useCallback, useState } from 'react';

export default function Index({ courses, categories, filters }) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);

    const { data, setData } = useForm({
        search: filters.search || '',
        category: filters.category || 'all',
        status: filters.status || 'all',
        sort: filters.sort || 'created_at_desc',
    });

    const confirmDelete = (course) => {
        setCourseToDelete(course);
        setDeleteDialogOpen(true);
    };

    const debouncedSearch = debounce((value) => {
        setData('search', value);
        applyFilters();
    }, 500);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setData('search', value);
        debouncedSearch(value);
    };

    const applyFilters = useCallback(() => {
        router.get(
            route('admin.courses.index'),
            {
                search: data.search,
                category: data.category,
                status: data.status,
                sort: data.sort,
            },
            {
                preserveState: false,
                preserveScroll: true,
                only: [],
            },
        );
    }, [data.search, data.category, data.status, data.sort]);

    const handleFilterChange = (field, value) => {
        setData((prevData) => ({
            ...prevData,
            [field]: value,
        }));

        router.get(
            route('admin.courses.index'),
            {
                ...data,
                [field]: value,
            },
            {
                preserveState: false,
                preserveScroll: true,
                only: [],
            },
        );
    };

    const resetFilters = () => {
        router.get(route('admin.courses.index'), {}, { preserveState: false });
    };

    const getStatusBadge = (course) => {
        if (!course.is_approved) {
            return <Badge variant="warning">Pending Approval</Badge>;
        }

        if (course.is_featured) {
            return <Badge variant="purple">Featured</Badge>;
        }

        if (course.is_published) {
            return <Badge variant="success">Published</Badge>;
        }

        return <Badge variant="secondary">Draft</Badge>;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Course Management" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Course Management</h1>
                    <Button asChild>
                        <Link href={route('admin.courses.create')}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Course
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Courses</CardTitle>
                        <CardDescription>
                            Manage courses across the platform
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search courses..."
                                    className="pl-8"
                                    value={data.search}
                                    onChange={handleSearchChange}
                                />
                            </div>

                            <Select
                                value={data.category}
                                onValueChange={(value) =>
                                    handleFilterChange('category', value)
                                }
                            >
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter by category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Categories
                                    </SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id.toString()}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={data.status}
                                onValueChange={(value) =>
                                    handleFilterChange('status', value)
                                }
                            >
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="published">
                                        Published
                                    </SelectItem>
                                    <SelectItem value="unpublished">
                                        Unpublished
                                    </SelectItem>
                                    <SelectItem value="approved">
                                        Approved
                                    </SelectItem>
                                    <SelectItem value="unapproved">
                                        Unapproved
                                    </SelectItem>
                                    <SelectItem value="featured">
                                        Featured
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={data.sort}
                                onValueChange={(value) =>
                                    handleFilterChange('sort', value)
                                }
                            >
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="created_at_desc">
                                        Newest First
                                    </SelectItem>
                                    <SelectItem value="created_at_asc">
                                        Oldest First
                                    </SelectItem>
                                    <SelectItem value="title_asc">
                                        Title (A-Z)
                                    </SelectItem>
                                    <SelectItem value="title_desc">
                                        Title (Z-A)
                                    </SelectItem>
                                    <SelectItem value="price_desc">
                                        Price (High-Low)
                                    </SelectItem>
                                    <SelectItem value="price_asc">
                                        Price (Low-High)
                                    </SelectItem>
                                    <SelectItem value="enrollments_desc">
                                        Most Enrolled
                                    </SelectItem>
                                    <SelectItem value="enrollments_asc">
                                        Least Enrolled
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {(data.search ||
                                data.category !== 'all' ||
                                data.status !== 'all') && (
                                <Button
                                    variant="outline"
                                    onClick={resetFilters}
                                    className="whitespace-nowrap"
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>

                        {courses.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-medium">
                                    No courses found
                                </h3>
                                <p className="text-muted-foreground">
                                    {data.search ||
                                    data.category !== 'all' ||
                                    data.status !== 'all'
                                        ? "Try adjusting your search or filters to find what you're looking for."
                                        : 'There are no courses in the system yet.'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="rounded-lg border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Course</TableHead>
                                                <TableHead>
                                                    Instructor
                                                </TableHead>
                                                <TableHead>Category</TableHead>
                                                <TableHead className="text-center">
                                                    Status
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    Price
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    Rating
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    Lessons
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    Students
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {courses.data.map((course) => (
                                                <TableRow key={course.id}>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-3">
                                                            <div className="h-10 w-10 overflow-hidden rounded-md bg-muted">
                                                                {course.thumbnail ? (
                                                                    <img
                                                                        src={`/storage/${course.thumbnail}`}
                                                                        alt={
                                                                            course.title
                                                                        }
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-full w-full items-center justify-center bg-primary/10">
                                                                        <BookOpen className="h-5 w-5 text-primary" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium">
                                                                    {
                                                                        course.title
                                                                    }
                                                                </div>
                                                                {course.level && (
                                                                    <div className="text-sm text-muted-foreground">
                                                                        {course.level
                                                                            .charAt(
                                                                                0,
                                                                            )
                                                                            .toUpperCase() +
                                                                            course.level.slice(
                                                                                1,
                                                                            )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {course.user?.name ||
                                                            'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {course.category
                                                            ?.name ||
                                                            'Uncategorized'}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {getStatusBadge(course)}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {formatCurrency(
                                                            course.price,
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center">
                                                            <Star className="mr-1 h-4 w-4 text-yellow-500" />
                                                            <span>
                                                                {Number(
                                                                    course.average_rating,
                                                                ).toFixed(1)}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {course.lessons_count ||
                                                            0}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {course.enrollments_count ||
                                                            0}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={route(
                                                                        'admin.courses.show',
                                                                        course.id,
                                                                    )}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={route(
                                                                        'admin.courses.edit',
                                                                        course.id,
                                                                    )}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                variant={
                                                                    course.is_approved
                                                                        ? 'outline'
                                                                        : 'success'
                                                                }
                                                                size="icon"
                                                                asChild
                                                                title={
                                                                    course.is_approved
                                                                        ? 'Unapprove'
                                                                        : 'Approve'
                                                                }
                                                            >
                                                                <Link
                                                                    href={route(
                                                                        'admin.courses.approve',
                                                                        course.id,
                                                                    )}
                                                                    method="patch"
                                                                >
                                                                    {course.is_approved ? (
                                                                        <XCircle className="h-4 w-4" />
                                                                    ) : (
                                                                        <CheckCircle className="h-4 w-4" />
                                                                    )}
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() =>
                                                                    confirmDelete(
                                                                        course,
                                                                    )
                                                                }
                                                                disabled={
                                                                    course.enrollments_count >
                                                                    0
                                                                }
                                                            >
                                                                <Trash className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                <div className="mt-4">
                                    <Pagination className="justify-end">
                                        <PaginationContent>
                                            {courses.links.map((link, i) => {
                                                if (
                                                    !link.url &&
                                                    link.label === '...'
                                                ) {
                                                    return (
                                                        <PaginationItem key={i}>
                                                            <PaginationEllipsis />
                                                        </PaginationItem>
                                                    );
                                                }

                                                if (
                                                    link.label.includes(
                                                        'Previous',
                                                    )
                                                ) {
                                                    return (
                                                        <PaginationItem key={i}>
                                                            <PaginationPrevious
                                                                onClick={() =>
                                                                    link.url &&
                                                                    router.visit(
                                                                        link.url,
                                                                    )
                                                                }
                                                                disabled={
                                                                    !link.url
                                                                }
                                                                className={
                                                                    !link.url
                                                                        ? 'pointer-events-none opacity-50'
                                                                        : 'cursor-pointer'
                                                                }
                                                            />
                                                        </PaginationItem>
                                                    );
                                                }

                                                if (
                                                    link.label.includes('Next')
                                                ) {
                                                    return (
                                                        <PaginationItem key={i}>
                                                            <PaginationNext
                                                                onClick={() =>
                                                                    link.url &&
                                                                    router.visit(
                                                                        link.url,
                                                                    )
                                                                }
                                                                disabled={
                                                                    !link.url
                                                                }
                                                                className={
                                                                    !link.url
                                                                        ? 'pointer-events-none opacity-50'
                                                                        : 'cursor-pointer'
                                                                }
                                                            />
                                                        </PaginationItem>
                                                    );
                                                }

                                                return (
                                                    <PaginationItem key={i}>
                                                        <PaginationLink
                                                            onClick={() =>
                                                                link.url &&
                                                                router.visit(
                                                                    link.url,
                                                                )
                                                            }
                                                            isActive={
                                                                link.active
                                                            }
                                                            disabled={!link.url}
                                                            className={
                                                                !link.url
                                                                    ? 'pointer-events-none opacity-50'
                                                                    : 'cursor-pointer'
                                                            }
                                                        >
                                                            {link.label}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            })}
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Course</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "
                            {courseToDelete?.title}"? This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button asChild variant="destructive">
                            <Link
                                href={
                                    courseToDelete
                                        ? route(
                                              'admin.courses.destroy',
                                              courseToDelete.id,
                                          )
                                        : '#'
                                }
                                method="delete"
                            >
                                Delete
                            </Link>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
