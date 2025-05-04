class Rental {
    static rentals = [];

    static create({ userId, movieId }) {
        const rental = {
            id: Date.now(),
            userId,
            movieId,
            rentalDate: new Date(),
            returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
            status: 'ACTIVE'
        };
        this.rentals.push(rental);
        return rental;
    }

    static getByUserId(userId) {
        return this.rentals.filter(rental => rental.userId === userId);
    }

    static getById(id) {
        return this.rentals.find(rental => rental.id === id);
    }

    static updateStatus(id, status) {
        const rental = this.getById(id);
        if (rental) {
            rental.status = status;
            return rental;
        }
        return null;
    }

    static deleteAll() {
        this.rentals = [];
        return Promise.resolve();
    }
}

module.exports = Rental; 