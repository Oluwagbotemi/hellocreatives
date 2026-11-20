import BlogList from '../(blog)';
import Wrapper from '@/components/wrapper';
import Footer from '@/components/footer';

export default function NewsletterPage() {
    return (
        <>
            <Wrapper>
                <BlogList />
            </Wrapper>
            <Footer />
        </>
    );
}
