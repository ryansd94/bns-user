import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import { ESize, Evariant } from "configs"

const AvatarControl = (props) => {
    const { size = ESize.small, name, cursor,
        onClick, className = "avatar", image = '', variant = Evariant.circular } = props
    let width = 56
    let height = 56
    let fontSize = 24

    if (size == ESize.miniSmall) {
        width = 24
        height = 24
        fontSize = 12
    }
    else if (size == ESize.small) {
        width = 42
        height = 42
        fontSize = 18
    }
    else if (size == ESize.large) {
        width = 100
        height = 100
        fontSize = 42
    }
    const stringToColor = (string) => {
        let hash = 0
        let i
        let length = string.length > 4 ? 5 : 0
        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << length) - hash)
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }

    const stringAvata = (name, props) => {
        if (!name)
            return
        return {
            sx: {
                bgcolor: stringToColor(name),
                fontSize: `${fontSize}px`,
                ...props
            },
            children: stringAvatarName(name).toUpperCase(),
        };
    }

    const stringAvatarName = (name) => {
        if (!name)
            return ''
        let names = name.split(' ')
        if (names.length > 1) {
            return `${names[0][0]}${names[1][0]}`
        }
        else
            return `${names[0][0]}`
    }
    return (
        <Avatar variant={variant} className={className} onClick={onClick} sx={{ color: 'white !important', width: width, height: height, cursor: cursor ? cursor : '' }}
            src={image} {...stringAvata(image ? '' : name, { color: 'white !important', width: width, height: height, cursor: cursor ?? '' })} aria-label="recipe"></Avatar>
    )
}
export default AvatarControl;