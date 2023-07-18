import Router from "vue-router";
import * as CONFIG from "./Config"
import Validation from "@/components/Validation";
import About from "@/components/About";

const router = new Router({
        mode: "history",
        base: "/proharmed",
        // base: "./",
        routes: [
            // {path:"/explore/:view/result/:job", component:App},
            // {path:"/", redirect:"/home"},
            {path: "/", component: Validation},
            {path: "/configure", component: Validation},
            {path: "/result", component: Validation},
            {path: "/about", component: About}
        ]
    },
);

export default router
