import { motion } from "framer-motion"

const Layout = ({children}: React.PropsWithChildren) => {
    return (
        <motion.article>
            {children}
        </motion.article>
    )
}

export default Layout