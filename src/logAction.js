import logDate from "./logDate.js";
import chalk from "chalk";

const logAction = () => `${logDate()}${chalk.white(`=>`)} `;

export default logAction;
