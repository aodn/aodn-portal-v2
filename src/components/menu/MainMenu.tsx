import * as React from 'react';
import {StyledButton} from './StyledMenu';
import './MainMenu.css';

const Menu = () => {
    return (
        <>
            <StyledButton name={'Data'} items={[{name: 'Item1', handler:()=> {}}]}/>
            <StyledButton name={'Learn'} items={[{name: 'Item1', handler:()=> {}}]}/>
            <StyledButton name={'Engage'} items={[{name: 'Item1', handler:()=> {}}]}/>
            <StyledButton name={'Contact'} items={[{name: 'Item1', handler:()=> {}}]}/>
            <StyledButton name={'About'} items={[{name: 'Item1', handler:()=> {}}]}/>
        </>
    );
}

export default Menu;