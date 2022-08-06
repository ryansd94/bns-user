import React, { useState } from "react";
import { AvatarControl } from 'components/avatar'
import ButtonIcon from "components/button/ButtonIcon";
import { EButtonIconType, ESize } from "configs";
import './style.scss';
const UserProfilePopover = (props) => {
    const { user, onBack } = props
    return (
        // <div className="grid-7 element-animation">
        <div className="card color-card-2">
            <ul>
                <li>
                    <ButtonIcon onClick={onBack} showTooltip={false} style={{ float: 'left' }} className="b"
                        type={EButtonIconType.back}></ButtonIcon>
                </li>
                <li>
                    <ButtonIcon showTooltip={false} style={{ float: 'right' }} className="b"
                        type={EButtonIconType.more}></ButtonIcon>
                </li>
            </ul>
            <AvatarControl size={ESize.large} name={user?.fullName} image={user?.image} className={"avatar"}></AvatarControl>
            <h1 className="title-2">{user?.fullName}</h1>
            <p className="job-title">{user?.teamName}</p>
            <div className="desc top">
                <p>Create usable interface and designs @GraphicSpark</p>
            </div>
            <button className="btn color-a top"> Hire me</button>

            <hr className="hr-2"></hr>
            <div className="container">
                <div className="content">
                </div>
            </div>
        </div>
        // </div >
    )
}
export default UserProfilePopover