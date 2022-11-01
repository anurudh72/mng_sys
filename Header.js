import React from "react";
import Dept from "./routes/departments.js";
import Home from "./routes/home.js";
import Instructors from "./routes/instructors.js";
import Section from "./routes/sections.js";
import Student from "./routes/students.js";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <nav className="nav navbar-fixed-top">
      <ul class="main-menu nav navbar-nav navbar-right">
        <li>
          <NavLink
            className="navbar-item"
            activeClassName="is-active"
            to="/FrontEnd/home"
            exact>
            Home
          </NavLink>
        </li>
        <li>
        <NavLink
            className="navbar-item"
            activeClassName="is-active"
            to="/FrontEnd/instructors"
            exact>
            Instructors
          </NavLink> 
        </li>
        <li>
            <NavLink
            className="navbar-item"
            activeClassName="is-active"
            to="/FrontEnd/departments"
            exact>
            Departments
          </NavLink>  
        </li>
        <li>
            <NavLink
            className="navbar-item"
            activeClassName="is-active"
            to="/FrontEnd/students"
            exact>
            Students
          </NavLink> 
        </li>  
        <li>
             <NavLink
            className="navbar-item"
            activeClassName="is-active"
            to="/FrontEnd/sections"
            exact>
            Sections
          </NavLink>  
        </li>
      </ul>
    </nav>
  );
};

export default Header;
