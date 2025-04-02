/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { classNames } from "primereact/utils";
import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";
import { AppTopbarRef } from "@/types";
import { LayoutContext } from "./context/layoutcontext";
import { getCurrentUser, logout } from "@/demo/service/auth";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
  const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } =
    useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current,
  }));
  const router = useRouter();
  const user = getCurrentUser();

  const isAuth = user !== null;

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const handleLogin = () => {
    router.push("/auth/login");
  };

  return (
    <div className="layout-topbar">
      <Link href="/" className="layout-topbar-logo">
        <img
          src={`/layout/images/logo-${
            layoutConfig.colorScheme !== "light" ? "white" : "dark"
          }.svg`}
          width="47.22px"
          height={"35px"}
          alt="logo"
        />
        <span>SAKAI</span>
      </Link>

      <button
        ref={menubuttonRef}
        type="button"
        className="p-link layout-menu-button layout-topbar-button"
        onClick={onMenuToggle}
      >
        <i className="pi pi-bars" />
      </button>

      <button
        ref={topbarmenubuttonRef}
        type="button"
        className="p-link layout-topbar-menu-button layout-topbar-button"
        onClick={showProfileSidebar}
      >
        <i className="pi pi-ellipsis-v" />
      </button>

      <div
        ref={topbarmenuRef}
        className={classNames("layout-topbar-menu", {
          "layout-topbar-menu-mobile-active": layoutState.profileSidebarVisible,
        })}
      >
        {isAuth ? (
          <div className="flex align-items-center gap-3">
            <div className="hidden md:flex align-items-center">
              <span className="text-500 mr-1">Hello,</span>
              <span className="font-medium text-900">{user?.name}</span>
            </div>
            <Button
              type="button"
              icon="pi pi-sign-out"
              label="Logout"
              onClick={handleLogout}
              severity="secondary"
              text
            >
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            icon="pi pi-sign-in"
            label="Login"
            onClick={handleLogin}
            severity="secondary"
            text
          >
          </Button>
        )}
        <button type="button" className="p-link layout-topbar-button">
          <i className="pi pi-user"></i>
          <span>Profile</span>
        </button>
        <Link href="/documentation">
          <button type="button" className="p-link layout-topbar-button">
            <i className="pi pi-cog"></i>
            <span>Settings</span>
          </button>
        </Link>
      </div>
    </div>
  );
});

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;
