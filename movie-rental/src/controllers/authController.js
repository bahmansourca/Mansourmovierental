const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
    static async register(req, res) {
        try {
            const { name, email, password } = req.body;
            
            // Vérifier si l'utilisateur existe déjà
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'Cet email est déjà utilisé' });
            }

            // Créer le nouvel utilisateur
            const userId = await User.create({ name, email, password });
            
            // Créer le token JWT
            const token = jwt.sign(
                { id: userId, role: 'user' },
                process.env.JWT_SECRET || 'votre_secret_jwt',
                { expiresIn: '24h' }
            );

            res.status(201).json({ 
                message: 'Utilisateur créé avec succès',
                token,
                user: {
                    id: userId,
                    name,
                    email,
                    role: 'user'
                }
            });
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            
            // Trouver l'utilisateur
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            }

            // Vérifier le mot de passe
            const isValidPassword = await User.verifyPassword(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            }

            // Créer le token JWT
            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET || 'votre_secret_jwt',
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Connexion réussie',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            res.status(500).json({ message: 'Erreur lors de la connexion' });
        }
    }
}

module.exports = AuthController; 