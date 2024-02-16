import * as React from 'react';
import {IpynbRenderer, IpynbType} from 'react-ipynb-renderer';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import {getNotebook} from "./api";
import {useEffect, useState} from "react";

export interface NotebookModelCallbackProps {
    showDialog: boolean
}

export interface NotebookModelProps {
    url?: string | undefined,
    callback?: (p: NotebookModelCallbackProps) => void | undefined,
    showDialog: boolean
}

const NotebookModel = (props : NotebookModelProps) => {

    const [open, setOpen] = useState<boolean>(false);
    const [nb, setNb] = useState<IpynbType | null>(null);

    useEffect(() => {
        setOpen(props.showDialog);
    }, [props.showDialog]);

    useEffect(() => {
        if(props.url != null) {
            getNotebook(props.url)
                .then((value: IpynbType) => setNb(value))
                .catch(reason => {
                    //TODO: Should print the error reason
                });
        }
        else {
            setNb(null);
        }
    }, [props.url]);

    return (
        <Dialog
            fullWidth
            maxWidth='xl'
            open={open}
            onClose={() => { setOpen(false); (props.callback && props.callback({showDialog: false}))}}
            scroll={'paper'}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            {nb &&
              <IpynbRenderer
                ipynb={nb}
              />
            }
        </Dialog>
    );
}

NotebookModel.defaultProps = {
    url: undefined,
    callback: (p: NotebookModelCallbackProps) => {},
    showDialog: false
}

export default NotebookModel;