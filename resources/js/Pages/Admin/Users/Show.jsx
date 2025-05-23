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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatCurrency } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    CreditCard,
    Edit,
    ExternalLink,
    Mail,
    Star,
    User as UserIcon,
    Users,
} from 'lucide-react';
import { useCallback, useEffect } from 'react';

export default function Show({ user, tab = 'overview' }) {
    const getRoleBadgeVariant = (role) => {
        switch (role) {
            case 'admin':
                return 'destructive';
            case 'instructor':
                return 'purple';
            case 'student':
                return 'success';
            default:
                return 'secondary';
        }
    };

    const handleTabChange = useCallback(
        (value) => {
            router.get(
                route('admin.users.show', user.id),
                { tab: value },
                { preserveState: true },
            );
        },
        [user.id],
    );

    useEffect(() => {
        // Ensure tab state is consistent with URL param
        if (
            tab !== 'overview' &&
            tab !== 'courses' &&
            tab !== 'enrollments' &&
            tab !== 'reviews' &&
            tab !== 'transactions'
        ) {
            handleTabChange('overview');
        }
    }, [tab, handleTabChange]);

    const renderPagination = (links) => {
        if (!links || links.length <= 3) return null;

        return (
            <div className="mt-4 flex items-center justify-end space-x-2">
                {links.map((link, i) => (
                    <Button
                        key={i}
                        variant={link.active ? 'default' : 'outline'}
                        disabled={!link.url}
                        onClick={() => router.visit(link.url)}
                        size="sm"
                        dangerouslySetInnerHTML={{
                            __html: link.label,
                        }}
                    ></Button>
                ))}
            </div>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title={`User: ${user.name}`} />

            <div className="space-y-6">
                <div className="flex justify-between">
                    <div className="flex flex-col gap-4">
                        <Link
                            href={route('admin.users.index')}
                            className="mb-2 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Back to Users
                        </Link>

                        <h1 className="text-3xl font-bold">
                            User Profile: {user.name}
                        </h1>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.users.edit', user.id)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit User
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* User Profile Card */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center text-center">
                            <div className="mb-4 h-24 w-24 overflow-hidden rounded-full bg-muted">
                                {user.profile_photo_path ? (
                                    <img
                                        src={`/storage/${user.profile_photo_path}`}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-primary/10">
                                        <UserIcon className="h-12 w-12 text-primary" />
                                    </div>
                                )}
                            </div>
                            <h3 className="text-xl font-medium">{user.name}</h3>
                            {user.headline && (
                                <p className="text-muted-foreground">
                                    {user.headline}
                                </p>
                            )}
                            <div className="mt-2">
                                <Badge variant={getRoleBadgeVariant(user.role)}>
                                    {user.role.charAt(0).toUpperCase() +
                                        user.role.slice(1)}
                                </Badge>
                            </div>

                            <div className="mt-6 w-full">
                                <div className="mb-4 flex items-center">
                                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span>{user.email}</span>
                                </div>

                                <div className="mt-4 space-y-2 border-t pt-4 text-left">
                                    <h4 className="font-medium">
                                        Member Since
                                    </h4>
                                    <p className="text-muted-foreground">
                                        {new Date(
                                            user.created_at,
                                        ).toLocaleDateString()}
                                    </p>

                                    {user.bio && (
                                        <>
                                            <h4 className="mt-4 font-medium">
                                                Bio
                                            </h4>
                                            <p className="text-muted-foreground">
                                                {user.bio}
                                            </p>
                                        </>
                                    )}

                                    {(user.website ||
                                        user.twitter ||
                                        user.linkedin ||
                                        user.youtube) && (
                                        <>
                                            <h4 className="mt-4 font-medium">
                                                Social Links
                                            </h4>
                                            <div className="space-y-2">
                                                {user.website && (
                                                    <div className="flex items-center">
                                                        <ExternalLink className="mr-2 h-4 w-4 text-muted-foreground" />
                                                        <a
                                                            href={user.website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary hover:underline"
                                                        >
                                                            Website
                                                        </a>
                                                    </div>
                                                )}
                                                {user.twitter && (
                                                    <div className="flex items-center">
                                                        <ExternalLink className="mr-2 h-4 w-4 text-muted-foreground" />
                                                        <a
                                                            href={`https://twitter.com/${user.twitter}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary hover:underline"
                                                        >
                                                            Twitter
                                                        </a>
                                                    </div>
                                                )}
                                                {user.linkedin && (
                                                    <div className="flex items-center">
                                                        <ExternalLink className="mr-2 h-4 w-4 text-muted-foreground" />
                                                        <a
                                                            href={`https://linkedin.com/in/${user.linkedin}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary hover:underline"
                                                        >
                                                            LinkedIn
                                                        </a>
                                                    </div>
                                                )}
                                                {user.youtube && (
                                                    <div className="flex items-center">
                                                        <ExternalLink className="mr-2 h-4 w-4 text-muted-foreground" />
                                                        <a
                                                            href={`https://youtube.com/channel/${user.youtube}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary hover:underline"
                                                        >
                                                            YouTube
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* User Activities */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>User Activity</CardTitle>
                            <CardDescription>
                                Overview of user's activities on the platform
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs
                                defaultValue={tab}
                                onValueChange={handleTabChange}
                            >
                                <TabsList className="mb-4 w-full">
                                    <TabsTrigger value="overview">
                                        Overview
                                    </TabsTrigger>
                                    {user.role === 'instructor' && (
                                        <TabsTrigger value="courses">
                                            Courses
                                        </TabsTrigger>
                                    )}
                                    {(user.role === 'student' ||
                                        user.role === 'instructor') && (
                                        <TabsTrigger value="enrollments">
                                            Enrollments
                                        </TabsTrigger>
                                    )}
                                    <TabsTrigger value="reviews">
                                        Reviews
                                    </TabsTrigger>
                                    <TabsTrigger value="transactions">
                                        Transactions
                                    </TabsTrigger>
                                </TabsList>

                                {/* Overview Tab */}
                                <TabsContent value="overview">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                                        <Card>
                                            <CardContent className="flex flex-col items-center p-6">
                                                <BookOpen className="mb-2 h-8 w-8 text-primary" />
                                                <h3 className="text-2xl font-bold">
                                                    {user.courses_count || 0}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Courses
                                                </p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent className="flex flex-col items-center p-6">
                                                <Users className="mb-2 h-8 w-8 text-primary" />
                                                <h3 className="text-2xl font-bold">
                                                    {user.enrollments_count ||
                                                        0}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Enrollments
                                                </p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent className="flex flex-col items-center p-6">
                                                <Star className="mb-2 h-8 w-8 text-primary" />
                                                <h3 className="text-2xl font-bold">
                                                    {user.reviews_count || 0}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Reviews
                                                </p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent className="flex flex-col items-center p-6">
                                                <CreditCard className="mb-2 h-8 w-8 text-primary" />
                                                <h3 className="text-2xl font-bold">
                                                    {user.transactions_count ||
                                                        0}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Transactions
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="mt-6">
                                        <p className="text-muted-foreground">
                                            User has been active since{' '}
                                            {new Date(
                                                user.created_at,
                                            ).toLocaleDateString()}
                                            .
                                            {user.role === 'instructor' &&
                                                ` As an instructor, they have created ${
                                                    user.courses_count || 0
                                                } courses and received ${
                                                    user.reviews_count || 0
                                                } reviews.`}
                                            {user.role === 'student' &&
                                                ` As a student, they have enrolled in ${
                                                    user.enrollments_count || 0
                                                } courses and left ${
                                                    user.reviews_count || 0
                                                } reviews.`}
                                        </p>
                                    </div>
                                </TabsContent>

                                {/* Courses Tab */}
                                <TabsContent value="courses">
                                    {user.courses &&
                                    user.courses.data &&
                                    user.courses.data.length > 0 ? (
                                        <>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Title
                                                        </TableHead>
                                                        <TableHead>
                                                            Students
                                                        </TableHead>
                                                        <TableHead>
                                                            Rating
                                                        </TableHead>
                                                        <TableHead>
                                                            Status
                                                        </TableHead>
                                                        <TableHead>
                                                            Created
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {user.courses.data.map(
                                                        (course) => (
                                                            <TableRow
                                                                key={course.id}
                                                            >
                                                                <TableCell>
                                                                    {
                                                                        course.title
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    {
                                                                        course.enrollments_count
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    {course.average_rating ? (
                                                                        <div className="flex items-center">
                                                                            <Star className="mr-1 h-4 w-4 text-yellow-500" />
                                                                            {Number(
                                                                                course.average_rating,
                                                                            ).toFixed(
                                                                                1,
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        'N/A'
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge
                                                                        variant={
                                                                            course.is_published
                                                                                ? 'success'
                                                                                : 'secondary'
                                                                        }
                                                                    >
                                                                        {course.is_published
                                                                            ? 'Published'
                                                                            : 'Draft'}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {new Date(
                                                                        course.created_at,
                                                                    ).toLocaleDateString()}
                                                                </TableCell>
                                                            </TableRow>
                                                        ),
                                                    )}
                                                </TableBody>
                                            </Table>
                                            {renderPagination(
                                                user.courses.links,
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-8 text-center">
                                            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                                            <h3 className="mb-2 text-lg font-medium">
                                                No courses found
                                            </h3>
                                            <p className="text-muted-foreground">
                                                This user hasn't created any
                                                courses yet.
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>

                                {/* Enrollments Tab */}
                                <TabsContent value="enrollments">
                                    {user.enrollments &&
                                    user.enrollments.data &&
                                    user.enrollments.data.length > 0 ? (
                                        <>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Course
                                                        </TableHead>
                                                        <TableHead>
                                                            Enrolled On
                                                        </TableHead>
                                                        <TableHead>
                                                            Progress
                                                        </TableHead>
                                                        <TableHead>
                                                            Status
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {user.enrollments.data.map(
                                                        (enrollment) => (
                                                            <TableRow
                                                                key={
                                                                    enrollment.id
                                                                }
                                                            >
                                                                <TableCell>
                                                                    {enrollment.course
                                                                        ? enrollment
                                                                              .course
                                                                              .title
                                                                        : 'N/A'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {new Date(
                                                                        enrollment.created_at,
                                                                    ).toLocaleDateString()}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {enrollment.progress_percentage
                                                                        ? `${Math.floor(enrollment.progress_percentage)}%`
                                                                        : '0%'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge
                                                                        variant={
                                                                            enrollment.completed_at
                                                                                ? 'success'
                                                                                : 'secondary'
                                                                        }
                                                                    >
                                                                        {enrollment.completed_at
                                                                            ? 'Completed'
                                                                            : 'In Progress'}
                                                                    </Badge>
                                                                </TableCell>
                                                            </TableRow>
                                                        ),
                                                    )}
                                                </TableBody>
                                            </Table>
                                            {renderPagination(
                                                user.enrollments.links,
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-8 text-center">
                                            <Users className="mb-4 h-12 w-12 text-muted-foreground" />
                                            <h3 className="mb-2 text-lg font-medium">
                                                No enrollments found
                                            </h3>
                                            <p className="text-muted-foreground">
                                                This user isn't enrolled in any
                                                courses yet.
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>

                                {/* Reviews Tab */}
                                <TabsContent value="reviews">
                                    {user.reviews &&
                                    user.reviews.data &&
                                    user.reviews.data.length > 0 ? (
                                        <>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Course
                                                        </TableHead>
                                                        <TableHead>
                                                            Rating
                                                        </TableHead>
                                                        <TableHead>
                                                            Comment
                                                        </TableHead>
                                                        <TableHead>
                                                            Date
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {user.reviews.data.map(
                                                        (review) => (
                                                            <TableRow
                                                                key={review.id}
                                                            >
                                                                <TableCell>
                                                                    {review.course
                                                                        ? review
                                                                              .course
                                                                              .title
                                                                        : 'N/A'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center">
                                                                        <Star className="mr-1 h-4 w-4 text-yellow-500" />
                                                                        {
                                                                            review.rating
                                                                        }
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="max-w-xs truncate">
                                                                        {review.comment ||
                                                                            'No comment'}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {new Date(
                                                                        review.created_at,
                                                                    ).toLocaleDateString()}
                                                                </TableCell>
                                                            </TableRow>
                                                        ),
                                                    )}
                                                </TableBody>
                                            </Table>
                                            {renderPagination(
                                                user.reviews.links,
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-8 text-center">
                                            <Star className="mb-4 h-12 w-12 text-muted-foreground" />
                                            <h3 className="mb-2 text-lg font-medium">
                                                No reviews found
                                            </h3>
                                            <p className="text-muted-foreground">
                                                This user hasn't written any
                                                reviews yet.
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>

                                {/* Transactions Tab */}
                                <TabsContent value="transactions">
                                    {user.transactions &&
                                    user.transactions.data &&
                                    user.transactions.data.length > 0 ? (
                                        <>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            ID
                                                        </TableHead>
                                                        <TableHead>
                                                            Amount
                                                        </TableHead>
                                                        <TableHead>
                                                            Type
                                                        </TableHead>
                                                        <TableHead>
                                                            Status
                                                        </TableHead>
                                                        <TableHead>
                                                            Date
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {user.transactions.data.map(
                                                        (transaction) => (
                                                            <TableRow
                                                                key={
                                                                    transaction.id
                                                                }
                                                            >
                                                                <TableCell>
                                                                    #
                                                                    {
                                                                        transaction.id
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    {formatCurrency(
                                                                        parseFloat(
                                                                            transaction.amount,
                                                                        ).toFixed(
                                                                            2,
                                                                        ),
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {transaction.type
                                                                        ? transaction.type
                                                                              .charAt(
                                                                                  0,
                                                                              )
                                                                              .toUpperCase() +
                                                                          transaction.type.slice(
                                                                              1,
                                                                          )
                                                                        : 'Purchase'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge
                                                                        variant={
                                                                            transaction.status ===
                                                                            'completed'
                                                                                ? 'success'
                                                                                : transaction.status ===
                                                                                    'pending'
                                                                                  ? 'secondary'
                                                                                  : transaction.status ===
                                                                                      'failed'
                                                                                    ? 'destructive'
                                                                                    : 'outline'
                                                                        }
                                                                    >
                                                                        {transaction.status
                                                                            .charAt(
                                                                                0,
                                                                            )
                                                                            .toUpperCase() +
                                                                            transaction.status.slice(
                                                                                1,
                                                                            )}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {new Date(
                                                                        transaction.created_at,
                                                                    ).toLocaleDateString()}
                                                                </TableCell>
                                                            </TableRow>
                                                        ),
                                                    )}
                                                </TableBody>
                                            </Table>
                                            {renderPagination(
                                                user.transactions.links,
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-8 text-center">
                                            <CreditCard className="mb-4 h-12 w-12 text-muted-foreground" />
                                            <h3 className="mb-2 text-lg font-medium">
                                                No transactions found
                                            </h3>
                                            <p className="text-muted-foreground">
                                                This user hasn't made any
                                                transactions yet.
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
