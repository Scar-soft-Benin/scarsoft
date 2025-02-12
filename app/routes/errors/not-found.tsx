import AppBaseButton from "~/components/appBaseButton";
import notFound from './notFound.jpg'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <img
                src={notFound}
                alt="404 Not Found"
                className="w-92 h-92 mb-4"
            />
            <h1 className="text-2xl font-semibold">404 - Page Not Found</h1>
            <p className="text-gray-600 my-4">
                Oops! The page you are looking for does not exist.
            </p>
            <AppBaseButton
                href="/"
                text="Back to home"
                textColor="text-dark"
                bgColor="bg-secondary"
                type="first"
            />
        </div>
    );
}
