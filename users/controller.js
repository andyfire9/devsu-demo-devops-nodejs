import User from './model.js'

export const listUsers = async (req, res) => {
    try {
        const users = await User.findAll()

        res.status(200).json(users)
    } catch (error) {
        console.error('listUsers() -> unknown', { error })
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const getUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByPk(id)
  
        if (user == null) {
            return res.status(404).json({ error: 'User not found: ' + id })
        }

        return res.status(200).json(user)
    } catch (error) {
        console.error('getUser() -> unknown', { error })
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const createUser = async (req, res) => {
    try {
        const userRequest = req.body
        const userExist = await User.findOne({ where: { dni: userRequest.dni } })

        if (userExist != null) {
            return res.status(400).json({ error: 'User already exists: ' + userRequest.dni })
        }

        const user = await User.create(userRequest)

        return res.status(201).json(user)
    } catch (error) {
        console.error('createUser() -> unknown', { error })
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const deactivateUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByPk(id)

        if (user == null) {
            return res.status(404).json({ error: 'User not found: ' + id })
        }

        if (!user.active) {
            return res.status(400).json({ error: 'User is already deactivated' })
        }

        user.active = false
        await user.save()

        return res.status(200).json({ message: 'User deactivated', user })
    } catch (error) {
        console.error('deactivateUser() -> unknown', { error })
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const reactivateUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByPk(id)

        if (user == null) {
            return res.status(404).json({ error: 'User not found: ' + id })
        }

        if (user.active) {
            return res.status(400).json({ error: 'User is already active' })
        }

        user.active = true
        await user.save()

        return res.status(200).json({ message: 'User reactivated', user })
    } catch (error) {
        console.error('reactivateUser() -> unknown', { error })
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByPk(id)

        if (user == null) {
            return res.status(404).json({ error: 'User not found: ' + id })
        }

        await user.destroy()

        return res.status(200).json({ message: 'User deleted' })
    } catch (error) {
        console.error('deleteUser() -> unknown', { error })
        res.status(500).json({ error: 'Internal Server Error' })
    }
}