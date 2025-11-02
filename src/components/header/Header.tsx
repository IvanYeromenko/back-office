import {
  styled,
  AppBar as MuiAppBar,
  Toolbar,
  Stack,
  Typography,
} from "@mui/material";
import ColorModeSelect from "@/theme/ColorModeSelect";
import { useGetEmployeeQuery } from "@/services";

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  borderWidth: 0,
  borderBottomWidth: 1,
  borderStyle: "solid",
  borderColor: (theme.vars ?? theme).palette.divider,
  boxShadow: "none",
  zIndex: theme.zIndex.drawer + 1,
}));

export const Header = () => {
  const { data } = useGetEmployeeQuery({ id: 1 }); // mocked id because /login request returns only token, there is no option to get logged in user data, I don't want to map users by email to find id
  const name = data?.data
    ? `${data.data.first_name} ${data.data.last_name}`
    : "";

  return (
    <AppBar color="inherit" position="absolute" sx={{ displayPrint: "none" }}>
      <Toolbar sx={{ backgroundColor: "inherit", mx: { xs: -0.75, sm: -1 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ marginLeft: "auto" }}
          >
            <Typography variant="h6" component="div" noWrap>
              {name}
            </Typography>
            <Stack direction="row" alignItems="center">
              <ColorModeSelect />
            </Stack>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
