import { styled, AppBar as MuiAppBar, Toolbar, Stack } from "@mui/material";
import ColorModeSelect from "@/theme/ColorModeSelect";

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  borderWidth: 0,
  borderBottomWidth: 1,
  borderStyle: "solid",
  borderColor: (theme.vars ?? theme).palette.divider,
  boxShadow: "none",
  zIndex: theme.zIndex.drawer + 1,
}));

export const Header = () => {
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
            <Stack direction="row" alignItems="center">
              <ColorModeSelect />
            </Stack>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
