import { Tab, Tabs, TabProps, TabsProps} from '@mui/material';
import { styled } from '@mui/material/styles';
import { borderRadius } from '../constants';
import grey from '../colors/grey';

const UnderlineTabs = styled((props: TabsProps) => (
    <Tabs 
        TabIndicatorProps={{
            sx: {
                background: grey['underlineTabSelected'],
                borderRadius: borderRadius,
                height: "10px"
            }
        }}
        centered={true}
        {...props} 
    />))(({ theme }) => ({
    }));

const UnderlineTab = styled((props: TabProps) => (
    <div>
        <Tab 
            {...props} 
        />
        <div style={{
                background: grey['underlineTabUnselected'],
                borderRadius: borderRadius,
                height: "10px"
            }}
        />
    </div>))(({ theme }) => ({
}));

export {
    UnderlineTabs,
    UnderlineTab
}