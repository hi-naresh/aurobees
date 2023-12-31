import React from 'react'
import { IconButton } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import './Header.css'
import { Link, useHistory } from 'react-router-dom';

function Header({ backButton }) {

    const history = useHistory();

    return (
        <div className='header'>
            {backButton ? (
                <IconButton onClick={() => history.replace(backButton)}>
                    <ArrowBackIosIcon fontSize='large' className='headerIcons' />
                </IconButton>

            ) : (
                <Link to='/profile'>
                    <img className='headerIcons' src='assets/user-square.png' alt='Abees' height={'28px'} />
                </Link>
            )}
            <Link to='/swipe'>
                <img className='headerIcons' src='assets/note.png' alt='Abees' height={'36px'} />
                {/* <img className='header__image' src='assets/abees.png' alt='Abees' /> */}
            </Link>
            <Link to='/chat'>
                <img className='headerIcons' src='assets/message-favorite.png' alt='Abees' height={'28px'} />
            </Link>
        </div>
    )
}

export default Header