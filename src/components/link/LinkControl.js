import React from "react";
import PropTypes from "prop-types";
import Link from '@mui/material/Link';

const LinkControl = (props) => {
    const { title, href, underline, onClick } = props

    return (
        <Link href={href && href}  onClick={onClick} underline={underline}>
            {title}
        </Link>
    );
}
LinkControl.propTypes = {
    href: PropTypes.string,
    underline: PropTypes.string,
};
LinkControl.defaultProps = {
    href: null,
    underline: "none"
};
export default LinkControl