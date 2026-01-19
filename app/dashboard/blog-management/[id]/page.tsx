import BlogDetails from "../../../ui/blog-management/blog-details";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <BlogDetails id={id} />;
}
