import { Grid, makeStyles } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { FileError, FileRejection, useDropzone } from 'react-dropzone';
import { SingleFileUploadWithProgress } from './';
import { UploadError } from './';

let currentId = 0;

function getNewId() {
    // we could use a fancier solution instead of a sequential ID :)
    return ++currentId;
}

// export interface UploadableFile {
//     // id was added after the video being released to fix a bug
//     // Video with the bug -> https://youtube-2021-feb-multiple-file-upload-formik-bmvantunes.vercel.app/bug-report-SMC-Alpha-thank-you.mov
//     // Thank you for the bug report SMC Alpha - https://www.youtube.com/channel/UC9C4AlREWdLoKbiLNiZ7XEA
//     id: number;
//     file: File;
//     errors: FileError[];
//     url?: string;
// }

const useStyles = makeStyles((theme) => ({
    dropzone: {
        border: `2px dashed ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.background.default,
        height: theme.spacing(10),
        outline: 'none',
    },
}));

const MultipleFileUploadField = ({ name }) => {
    const classes = useStyles();

    const [files, setFiles] = useState([])
    const onDrop = useCallback((accFiles, rejFiles) => {
        const mappedAcc = accFiles.map((file) => ({ file, errors: [], id: getNewId() }));
        const mappedRej = rejFiles.map((r) => ({ ...r, id: getNewId() }));
        setFiles((curr) => [...curr, ...mappedAcc, ...mappedRej]);
    }, []);

    useEffect(() => {
        console.log(files);
        // helpers.setTouched(true);
    }, [files]);

    const onUpload = (file, url) => {
        setFiles((curr) =>
            curr.map((fw) => {
                if (fw.file === file) {
                    return { ...fw, url };
                }
                return fw;
            })
        );
    }

    const onDelete = (file) => {
        setFiles((curr) => curr.filter((fw) => fw.file !== file));
    }

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: ['image/*', 'video/*', '.pdf'],
        maxSize: 300 * 1024, // 300KB
    });

    return (
        <React.Fragment>
            <Grid item>
                <div {...getRootProps({ className: classes.dropzone })}>
                    <input {...getInputProps()} />

                    <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
            </Grid>

            {files.map((fileWrapper) => (
                <Grid item key={fileWrapper.id}>
                    {fileWrapper.errors.length ? (
                        <UploadError
                            file={fileWrapper.file}
                            errors={fileWrapper.errors}
                            onDelete={onDelete}
                        />
                    ) : (
                        <SingleFileUploadWithProgress
                            onDelete={onDelete}
                            onUpload={onUpload}
                            file={fileWrapper.file}
                        />
                    )}
                </Grid>
            ))}
        </React.Fragment>
    );
}
export default MultipleFileUploadField