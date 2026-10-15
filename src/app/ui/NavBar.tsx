import { Link } from "react-router";

import styles from "./NavBar.module.css";

export function NavBar() {
  const btns = [
    {
      icon: "home",
      path: "/",
    },
    {
      icon: "account_tree",
      path: "/struct",
    },
  ];

  return (
    <div className={styles["navigation"]}>
      <ul className={styles["navigation__list"]}>
        {btns.map((el) => (
          <li key={el.path}>
            <Link to={el.path}>
              <span className="material-symbols-outlined">{el.icon}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
