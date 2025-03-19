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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { debounce } from 'lodash';
import {
    Edit,
    Eye,
    Folder,
    FolderTree,
    PlusCircle,
    Search,
    Trash,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Index({ categories, filters }) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');

    const confirmDelete = (category) => {
        setCategoryToDelete(category);
        setDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        router.delete(route('admin.categories.destroy', categoryToDelete.id), {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setCategoryToDelete(null);
            },
        });
    };

    const handleSearch = debounce((value) => {
        router.get(
            route('admin.categories.index'),
            { search: value },
            { preserveState: true },
        );
    }, 300);

    useEffect(() => {
        setSearchTerm(filters?.search || '');
    }, [filters]);

    return (
        <AuthenticatedLayout>
            <Head title="Category Management" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Category Management</h1>
                    <Button asChild>
                        <Link href={route('admin.categories.create')}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Category
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Categories</CardTitle>
                        <CardDescription>
                            Manage course categories across the platform
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search categories..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        handleSearch(e.target.value);
                                    }}
                                />
                            </div>
                        </div>

                        {categories.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                <FolderTree className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-medium">
                                    No categories found
                                </h3>
                                <p className="text-muted-foreground">
                                    {searchTerm
                                        ? "Try adjusting your search to find what you're looking for."
                                        : 'There are no categories in the system yet.'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Parent</TableHead>
                                            <TableHead className="text-center">
                                                Courses
                                            </TableHead>
                                            <TableHead className="text-center">
                                                Subcategories
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {categories.data.map((category) => (
                                            <TableRow key={category.id}>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                                                            {category.icon ? (
                                                                <span className="text-primary">
                                                                    {
                                                                        category.icon
                                                                    }
                                                                </span>
                                                            ) : (
                                                                <Folder className="h-5 w-5 text-primary" />
                                                            )}
                                                        </div>
                                                        <div className="font-medium">
                                                            {category.name}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-xs truncate">
                                                        {category.description ||
                                                            'No description'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {category.parent ? (
                                                        <Badge variant="outline">
                                                            {
                                                                category.parent
                                                                    .name
                                                            }
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            None
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="secondary">
                                                        {category.courses_count}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="secondary">
                                                        {
                                                            category.children_count
                                                        }
                                                    </Badge>
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
                                                                    'admin.categories.show',
                                                                    category.id,
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
                                                                    'admin.categories.edit',
                                                                    category.id,
                                                                )}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() =>
                                                                confirmDelete(
                                                                    category,
                                                                )
                                                            }
                                                            disabled={
                                                                category.courses_count >
                                                                    0 ||
                                                                category.children_count >
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

                                {/* Pagination */}
                                {categories.links && (
                                    <div className="mt-4">
                                        <Pagination className="justify-end">
                                            <PaginationContent>
                                                {categories.links.map(
                                                    (link, i) => {
                                                        if (
                                                            !link.url &&
                                                            link.label === '...'
                                                        ) {
                                                            return (
                                                                <PaginationItem
                                                                    key={i}
                                                                >
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
                                                                <PaginationItem
                                                                    key={i}
                                                                >
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
                                                            link.label.includes(
                                                                'Next',
                                                            )
                                                        ) {
                                                            return (
                                                                <PaginationItem
                                                                    key={i}
                                                                >
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
                                                            <PaginationItem
                                                                key={i}
                                                            >
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
                                                                    disabled={
                                                                        !link.url
                                                                    }
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
                                                    },
                                                )}
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the category "
                            {categoryToDelete?.name}"? This action cannot be
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
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
