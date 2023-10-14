import { makeStyles } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { SingleFileUploadWithProgress, FileItem } from "./";
import { UploadError } from "./";
import { useTranslation } from "react-i18next";
import ButtonIcon from "components/button/ButtonIcon";
import { EButtonIconType } from "configs";
import { Controller } from "react-hook-form";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

function getNewId() {
  return uuidv4();
}

const useStyles = makeStyles((theme) => ({
  dropzone: {
    border: `2px dashed ${theme.palette.primary.border_color}`,
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // background: theme.palette.background.default,
    height: "auto",
    outline: "none",
  },
}));

const MultipleFileUploadField = ({ name, control, setValue, getValues }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [files, setFiles] = useState((getValues && getValues(name)) || []);
  const onDrop = useCallback((accFiles, rejFiles) => {
    const mappedAcc = accFiles.map((file) => ({
      file,
      errors: [],
      id: getNewId(),
      isAddNew: true,
    }));
    const mappedRej = rejFiles.map((r) => ({
      ...r,
      id: getNewId(),
      isAddNew: true,
    }));
    setFiles((curr) => [...curr, ...mappedAcc, ...mappedRej]);
  }, []);

  useEffect(() => {
    console.log(files);
    setValue && setValue(name, files);
  }, [files]);

  const onUpload = (file, url) => {
    setFiles((curr) =>
      curr.map((fw) => {
        if (fw.file === file) {
          return { ...fw, url, isAddNew: true };
        }
        return fw;
      }),
    );
  };

  const onDelete = (id) => {
    var fileDelete = _.find(files, (x) => x.id === id);
    if (_.isNil(fileDelete)) return;
    if (fileDelete.isAddNew !== true) {
      fileDelete.isDelete = true;
      setValue && setValue(name, files);
      return;
    }
    setFiles((curr) => curr.filter((fw) => fw.id !== id));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ["image/*", "video/*", ".pdf"],
    maxSize: 1000 * 1024, // 300KB
  });

  return (
    <Grid container spacing={2} item>
      <Grid item style={{ width: "100%" }}>
        <div {...getRootProps({ className: classes.dropzone })}>
          <Grid
            className="flex-container"
            container
            spacing={2}
            item
            alignItems={"center"}
            direction="column"
          >
            <Grid item xs>
              <input {...getInputProps()} />
            </Grid>
            <Grid item xs>
              <span>
                {t("Drag and drop files here or tap to select files")}
              </span>
            </Grid>
            <Grid item xs>
              <ButtonIcon type={EButtonIconType.upload} />
            </Grid>
          </Grid>
        </div>
      </Grid>
      <Grid item style={{ width: "100%" }}>
        <Controller
          render={({ field, fieldState: { error } }) => (
            <Grid container spacing={2}>
              {!_.isNil(field?.value)
                ? _.map(
                    _.filter(field?.value, (x) => x.isDelete !== true),
                    (fileWrapper) => {
                      return (
                        <Grid
                          style={{ width: "100%" }}
                          item
                          key={fileWrapper.id}
                        >
                          {fileWrapper.errors?.length ? (
                            <UploadError
                              file={fileWrapper}
                              url={fileWrapper.url}
                              errors={fileWrapper.errors}
                              onDelete={onDelete}
                            />
                          ) : (
                            <SingleFileUploadWithProgress
                              onDelete={onDelete}
                              onUpload={onUpload}
                              file={fileWrapper}
                            />
                          )}
                        </Grid>
                      );
                    },
                  )
                : ""}
            </Grid>
          )}
          name={name}
          control={control && control}
        />
      </Grid>
    </Grid>
  );
};
export default MultipleFileUploadField;
