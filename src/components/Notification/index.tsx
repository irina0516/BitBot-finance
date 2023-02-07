import { Store } from "react-notifications-component";

type NOTIFICATION_TYPE = "success" | "danger" | "info" | "default" | "warning";
const AddNotification = (
    title: string,
    message: string,
    type: NOTIFICATION_TYPE
) => {
    Store.addNotification({
        title: title,
        message: message,
        type: type,
        container: "top-right",
        insert: "top",
        animationIn: ["animate__animated animate__fadeIn"], // `animate.css v4` classes
        animationOut: ["animate__animated animate__fadeOut"], // `animate.css v4` classes
        dismiss: {
            duration: 2000,
            onScreen: true,
        },
    });
};
export { AddNotification };
