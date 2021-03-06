import React from "react";
import { Button } from "@material-ui/core";

export interface IRideControlCardActionProps {
    text: string;
    color?: "primary" | "secondary";
    onClick?: () => void;
}

export default function RideControlCardAction(props: IRideControlCardActionProps) {

    const defaultText = "Click";

    const getText = () => props.text === "" ? defaultText : props.text;
    const getColor = () => props.color === undefined ? "primary" : props.color;
    const handleClick = () => { if (props.onClick !== undefined) props.onClick() };

    return <Button size="medium"
        className="home-control-card-button"
        variant="contained"
        color={getColor()}
        onClick={handleClick}
    >
        {getText()}
    </Button>;
}