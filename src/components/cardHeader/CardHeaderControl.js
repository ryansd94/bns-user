import * as React from 'react';
import CardHeader from '@mui/material/CardHeader';
import { AvatarControl } from 'components/avatar'

const CardHeaderControl = (props) => {
    const { title, subheader, avatar, style,cursor,onAvatarClick } = props;
    return (
        <CardHeader
            style={style ? style : {}}
            avatar={
                <AvatarControl onClick={onAvatarClick} cursor={cursor} name={avatar}></AvatarControl>
            }
            title={title}
            subheader={subheader}
        />)
}
export default CardHeaderControl