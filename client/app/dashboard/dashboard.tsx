import { Outlet } from "react-router";
import Message from "~/components/message";

export default function Dashboard() {
    return (
            <>
                <Message />
                
                <Outlet />
            </>
        );;
}
