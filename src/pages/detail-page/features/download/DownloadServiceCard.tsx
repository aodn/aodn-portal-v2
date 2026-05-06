import {
  ComponentProps,
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { Stack, Typography } from "@mui/material";
import DownloadSelect from "./DownloadSelect";
import DownloadSubsetting from "./DownloadSubsetting";
import { SelectItem } from "../../../../components/common/dropdown/CommonSelect";
import { portalTheme } from "../../../../styles";

interface DownloadServiceCardContextValue {
  isFormatOpen: boolean;
  isDataOpen: boolean;
  isAnySelectOpen: boolean;
  setFormatOpen: (open: boolean) => void;
  setDataOpen: (open: boolean) => void;
}

const DownloadServiceCardContext =
  createContext<DownloadServiceCardContextValue | null>(null);

const useDownloadServiceCard = () => {
  const ctx = useContext(DownloadServiceCardContext);
  if (!ctx) {
    throw new Error(
      "DownloadServiceCard.Form and DownloadServiceCard.Subsetting must be rendered inside <DownloadServiceCard>"
    );
  }
  return ctx;
};

const DownloadServiceCardProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isFormatOpen, setFormatOpen] = useState(false);
  const [isDataOpen, setDataOpen] = useState(false);

  const contextValue = useMemo<DownloadServiceCardContextValue>(
    () => ({
      isFormatOpen,
      isDataOpen,
      isAnySelectOpen: isFormatOpen || isDataOpen,
      setFormatOpen,
      setDataOpen,
    }),
    [isFormatOpen, isDataOpen]
  );

  return (
    <DownloadServiceCardContext.Provider value={contextValue}>
      <Stack>{children}</Stack>
    </DownloadServiceCardContext.Provider>
  );
};

interface SelectFieldProps {
  items: SelectItem[];
  value?: string;
  onSelectCallback: (value: string) => void;
}

interface FormProps {
  formatProps: SelectFieldProps;
  dataProps: SelectFieldProps;
  disabled?: boolean;
  downloadButton: ReactNode;
  progressContent?: ReactNode;
}

const OPEN_SELECT_HINT = "map tools to make your selection.";

const hintTextSx = {
  ...portalTheme.typography.body2Regular,
  color: portalTheme.palette.text2,
  textAlign: "center",
  py: 0,
};

const Form: FC<FormProps> = ({
  formatProps,
  dataProps,
  disabled,
  downloadButton,
  progressContent,
}) => {
  const {
    isFormatOpen,
    isDataOpen,
    isAnySelectOpen,
    setFormatOpen,
    setDataOpen,
  } = useDownloadServiceCard();

  return (
    <Stack sx={{ p: "16px" }} spacing={2}>
      {!isDataOpen && (
        <DownloadSelect
          label="Format Selection"
          disabled={disabled}
          items={formatProps.items}
          value={formatProps.value}
          onSelectCallback={formatProps.onSelectCallback}
          onOpenChange={setFormatOpen}
        />
      )}
      {!isFormatOpen && (
        <DownloadSelect
          label="Data Selection"
          disabled={disabled}
          items={dataProps.items}
          value={dataProps.value}
          onSelectCallback={dataProps.onSelectCallback}
          onOpenChange={setDataOpen}
        />
      )}
      {isAnySelectOpen ? (
        <Typography sx={hintTextSx}>{OPEN_SELECT_HINT}</Typography>
      ) : (
        downloadButton
      )}
      {progressContent}
    </Stack>
  );
};

type SubsettingProps = Omit<
  ComponentProps<typeof DownloadSubsetting>,
  "disable"
> & {
  disabled?: boolean;
};

const Subsetting: FC<SubsettingProps> = ({
  hideInfoMessage,
  disabled,
  ...rest
}) => {
  const { isAnySelectOpen } = useDownloadServiceCard();
  return (
    <DownloadSubsetting
      {...rest}
      disable={disabled}
      hideInfoMessage={hideInfoMessage || isAnySelectOpen}
    />
  );
};

DownloadServiceCardProvider.displayName = "DownloadServiceCard";
Form.displayName = "DownloadServiceCard.Form";
Subsetting.displayName = "DownloadServiceCard.Subsetting";

const DownloadServiceCard = Object.assign(DownloadServiceCardProvider, {
  Form,
  Subsetting,
});

export default DownloadServiceCard;
