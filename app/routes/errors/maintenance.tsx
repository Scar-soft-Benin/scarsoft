import AppBaseButton from "~/components/appBaseButton";
import maintenanceSVG from './construction-illustration.jpg'

export default function Maintenance() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <img
                src={maintenanceSVG}
                alt="Under Maintenance"
                className="w-96 h-96 mb-4"
            />
            <h1 className="text-3xl font-semibold mb-2">We'll be back soon!</h1>
            <p className="text-lg text-gray-600 my-4">
                This page is currently under maintenance. Please check back
                later.
            </p>
            <AppBaseButton
                href="/"
                text="Go to home"
                textColor="text-dark"
                bgColor="bg-secondary"
                type="first"
            />
        </div>
    );
}
