import { Router } from "express";

const router = Router();

router.get("/redirect", (req, res) => {
  if (req.user.role === 'admin') {
    return res.redirect("/admin/panel");
  }
  return res.redirect("/signin");
});

export default router;
