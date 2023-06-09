import { UnAuthenticatedError } from "../errors/index.js";

const checkPermissions = (requestUser, resourceUserId) => {
    if (requestUser.userId === resourceUserId.toString()) return
    // set admin can edit 
    // if (requestUser.role === "admin") return
    throw new UnAuthenticatedError("Not authorized to access this route")
};

export default checkPermissions;
