import React from "react";

interface IProfilePropertyProps {
    /**
     * The label should describe the represented property. It is shown as the
     * primary text.
     */
    label: string;
    /**
     * The value is associated to a property and is optional. It is shown as
     * a secondary text under the label.
     */
    value?: string;
    /**
     * Is an action rendering an icon. The icon is used to describe an action
     * related to the label.
     */
    renderIcon?: () => any;
}

/**
 * This component is used to display one of the properties in a profile
 * section.
 */
function ProfileProperty(props: IProfilePropertyProps) {

    const Icon = props.renderIcon!!;

    const showValue = (): boolean => props.value !== undefined;
    const showIcon = (): boolean => props.renderIcon !== undefined;

    return <div className="profile-property">
        <div className="profile-property-header">
            <p className="primary-text">{props.label}</p>
            {showValue() && <p className="secondary-text">{props.value}</p>}
        </div>
        {showIcon() && <Icon />}
    </div>;
}

export default ProfileProperty;