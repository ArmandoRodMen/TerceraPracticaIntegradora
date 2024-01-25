import { Router } from "express";
import { messagesDao } from "../DAL/DAO/mongodb/messages.dao.js";
import { usersDao } from "../DAL/DAO/mongodb/users.dao.js";
import { productsDao } from "../DAL/DAO/mongodb/products.dao.js";
import { cartsDao } from "../DAL/DAO/mongodb/carts.dao.js";
import { transporter } from "../nodemailer.js";
import bcrypt from "bcrypt";
import { compareData, hashData } from "../utils.js";

const router = Router();

router.get("/chat", async (req, res) => {
  if(!req.session.user){
    res.redirect(`/login`);
  }else{
  const messages = await messagesDao.findAll();
  const {username } = username;
  res.render("chat", { messages, username });
  }
});

router.get("/products", async (req, res) => {
  const products = await productsDao.findAggregation(req.query);
  res.render("products", { products: products });
});

router.get("/cart/:idCart", async (req, res) => {
  const {idCart} = req.params;
  const cartProducts = await cartsDao.findProductsInCart(idCart);
  res.render("cart", {idCart, products:cartProducts} );
});

router.get("/signup", (req, res) => {
  if(req.session.user){
    res.redirect(`/profile/${req.session.user.userId}`);
  }else{
    res.render("signup");
  }
});

router.get("/login", async (req, res) => {
  if(req.session.user){
    res.redirect(`/profile/${req.session.user.userId}`);
  }else{
    res.render("login");
  }
});

router.get("/profile/:idUser", async (req, res) => {
  if(!req.session.user){
    res.redirect(`/login`);
  }else{
  const { idUser } = req.params;
  const user = await usersDao.findById(idUser);
  const products = await productsDao.findAll();
  const { first_name, last_name, username } = user;
  res.render("profile", { first_name, last_name, username, products });
  }
});

router.get("/profile",(req, res)=>{
  /*
  console.log("probando", req);
  res.render("profile", {user:{first_name:"", username:""}});
  */
  if (!req.session.passport){
    return res.redirect("/login");
  }
  const {username} = req.user;
  res.render("profile", {username});
});

router.get("/restaurar",(req, res) =>{
  res.render("restaurar");
});

router.post("/restaurar", async (req, res) => {
  const { email } = req.body;
  const user = await usersDao.findByEmail(email);

  if (user != null) {
    // Set the expiration time to one hour from now
    const expirationTime = Date.now() + 3600000;

    // Generate a random number and convert it to a string
    const randomNumber = Math.floor(Math.random() * 1000000);
    const stringNumber = randomNumber.toString();

    await user.save();

    // Generate a hash of the token
    const hashedToken = await bcrypt.hash(stringNumber, 10);

    // Convert the hashedToken to hexadecimal
    let token = Buffer.from(hashedToken, 'binary').toString('hex');
    token = token.slice(0, 13);

    user.resetToken = token;
    user.resetTokenExpiration = expirationTime;

    // Update the user's record with the reset token hash and expiration time
    await usersDao.updatePasswordResetToken(email, token, expirationTime);

    // Construct the reset link to be included in the email
    const resetLink = `http://localhost:8080/reset/${token}`;

    const mailOptions = {
      from: "Armando Ecommerce",
      to: email,
      subject: "Restaurar contraseña",
      html: `
        <h1>Un saludo desde Armando Ecommerce</h1>
        <p>Hola,</p>
        <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
        <a href="${resetLink}">Restablecer Contraseña</a>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Atentamente,<br>El equipo de Ecommerce</p>
      `,
    };

    // Send the email with the reset link
    await transporter.sendMail(mailOptions);
    res.redirect("/login");
  } else {
    console.log("User not found");
    res.redirect("/login");
  }
});

router.get("/reset/:token", async (req, res) => {
  const { token } = req.params;
  // Render the reset.handlebars template with the token parameter
  res.render("reset", { token });
});

router.get("/reset", async(req, res) =>{
  res.render("signup");
})

router.post("/reset/:token", async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { token } = req.params;

  // Busca al usuario por el token de reinicio
  const user = await usersDao.findByResetToken(token);

  // Verifica si el token es válido y no ha expirado
  if (user && user.resetTokenExpiration > Date.now()) {
    try {
      const isPasswordInValid = await compareData(password, user.password);
      console.log(password,"\n =",user.password,"\n", isPasswordInValid);
      // Verifica que la nueva contraseña no sea igual a la contraseña actual
      if (isPasswordInValid) {
        // Genera el hash de la nueva contraseña
        const hashedPassword = await hashData(password);
        // Actualiza la contraseña del usuario en la base de datos
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;

        await user.save();

        // Redirige al usuario a una página de éxito o página de inicio de sesión
        return res.redirect("/login");
      }
      console.log("El password debe ser distinto")
    } catch (error) {
      // Manejo de errores al guardar en la base de datos
      console.error("Error al guardar la nueva contraseña:", error);
      return res.render("reset", { error: "Error al restablecer la contraseña", token });
    }
  }

  // Maneja el caso en que el token es inválido o ha expirado
  res.render("reset", { error: "Token no válido o expirado", token });
});

export default router;



/*
router.post("/restaurar", async (req, res) => {
  const { email } = req.body;

  // Generate a unique token for this restoration request
  const token = crypto.randomBytes(20).toString("hex");

  // Set the expiration time to one hour from now
  const expirationTime = Date.now() + 3600000;

  // Save the token and expiration time in the database
  await usersDao.updatePasswordResetToken(email, token, expirationTime);

  const resetLink = `${process.env.BASE_URL}/reset/${token}`;

  const mailOptions = {
    from: "Armando Ecommerce",
    to: email,
    subject: "Restaurar contraseña",
    html: `
      <h1>Un saludo desde Armando Ecommerce</h1>
      <p>Hola,</p>
      <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
      <a href="${resetLink}">Restablecer Contraseña</a>
      <p>Este enlace expirará en 1 hora.</p>
      <p>Atentamente,<br>El equipo de Ecommerce</p>
    `,
  };

  console.log("Mail enviado: ", email);

  await transporter.sendMail(mailOptions);

  res.redirect("/login");
});

// Route for handling the password reset form rendering
router.get("/reset/:token", async (req, res) => {
  const { token } = req.params;
  const user = await usersDao.findByPasswordResetToken(token);

  if (!user || user.passwordResetTokenExpiry < Date.now()) {
    return res.render("error", { message: "Invalid or expired token" });
  }

  // Render a password reset form
  res.render("reset", { token });
});

// Route for handling the password reset form submission
router.post("/reset/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await usersDao.findByPasswordResetToken(token);

  if (!user || user.passwordResetTokenExpiry < Date.now()) {
    return res.render("error", { message: "Invalid or expired token" });
  }

  // Update the user's password and clear the reset token
  const hashedPassword = await hashData(password);
  await usersDao.updatePasswordAndClearToken(user.email, hashedPassword);

  res.redirect("/login");
});
*/