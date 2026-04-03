// components/common/BOICard.jsx
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Divider,
  Box,
} from "@mui/material";

const BOICard = ({
  title,
  subtitle,
  children,
  actions,
  elevation = 3,
  headerAction,
  ...props
}) => {
  return (
    <Card elevation={elevation} sx={{ width: "100%", ...props.sx }}>
      {(title || subtitle || headerAction) && (
        <>
          <CardHeader
            title={
              title && (
                <Typography
                  variant="h5"
                  sx={{ color: "#1976d2", fontWeight: "bold" }}
                >
                  {title}
                </Typography>
              )
            }
            subheader={
              subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )
            }
            action={headerAction}
            sx={{ pb: 1 }}
          />
          <Divider />
        </>
      )}
      <CardContent>{children}</CardContent>
      {actions && (
        <>
          <Divider />
          <CardActions>{actions}</CardActions>
        </>
      )}
    </Card>
  );
};

export default BOICard;
