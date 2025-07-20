import * as express from "express"
import { 
    listUsers, 
    getUser, 
    createUser,
    deactivateUser,
    reactivateUser,
    deleteUser
} from "./controller.js"
import { validateSchema } from "../shared/middleware/validateSchema.js"
import { getUserSchema, addUserSchema } from "../shared/schema/users.js"

const usersRouter = express.Router()

usersRouter.get("/", listUsers)
usersRouter.get("/:id", validateSchema(getUserSchema), getUser)
usersRouter.post("/", validateSchema(addUserSchema), createUser)
usersRouter.patch("/:id/deactivate", validateSchema(getUserSchema), deactivateUser)
usersRouter.patch("/:id/reactivate", validateSchema(getUserSchema), reactivateUser)
usersRouter.delete("/:id", validateSchema(getUserSchema), deleteUser)

export { usersRouter }