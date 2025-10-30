import NextLink from "next/link";
import {
  styled,
  Box,
  Breadcrumbs,
  breadcrumbsClasses,
  Container,
  type ContainerProps,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { Header } from "../header";

const PageContentHeader = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: theme.spacing(2),
}));

const PageHeaderBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
  },
}));

const PageHeaderToolbar = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing(1),
  marginLeft: "auto",
}));

export interface IBreadcrumb {
  title: string;
  path?: string;
}
export interface IPageContainerProps extends ContainerProps {
  children?: React.ReactNode;
  title?: string;
  breadcrumbs?: IBreadcrumb[];
  actions?: React.ReactNode;
}

export const PageContainer = (props: IPageContainerProps) => {
  const { children, breadcrumbs, title, actions = null } = props;

  return (
    <>
      <Header />
      <Box sx={(theme) => theme.mixins.toolbar} />
      <Container sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Stack sx={{ flex: 1, my: 2 }} spacing={2}>
          <Stack>
            <PageHeaderBreadcrumbs
              aria-label="breadcrumb"
              separator={<NavigateNextRoundedIcon fontSize="small" />}
            >
              {breadcrumbs
                ? breadcrumbs.map((breadcrumb, index) => {
                    return breadcrumb.path ? (
                      <MuiLink
                        key={index}
                        component={NextLink}
                        underline="hover"
                        color="inherit"
                        href={breadcrumb.path}
                      >
                        {breadcrumb.title}
                      </MuiLink>
                    ) : (
                      <Typography
                        key={index}
                        sx={{ color: "text.primary", fontWeight: 600 }}
                      >
                        {breadcrumb.title}
                      </Typography>
                    );
                  })
                : null}
            </PageHeaderBreadcrumbs>
            <PageContentHeader>
              {title ? <Typography variant="h4">{title}</Typography> : null}
              <PageHeaderToolbar>{actions}</PageHeaderToolbar>
            </PageContentHeader>
          </Stack>
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {children}
          </Box>
        </Stack>
      </Container>
    </>
  );
};
