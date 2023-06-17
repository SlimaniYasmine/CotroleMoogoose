const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  age: Number,
  favoriteFoods: [String]
});

const Person = mongoose.model('Person', personSchema);

const personne = new Person({
  nom: 'SLIMANI',
  age: 26,
  favoriteFoods: ['Pizza', 'tacos']
});

personne.save()
  .then(data => {
    console.log('Personne enregistrée:', data);

    const arrayOfPeople = [
      { nom: 'sl y', age: 14, favoriteFoods: ['Pizza', 'rechta'] },
      { nom: 'sl a', age: 17, favoriteFoods: ['cheese', 'panini'] },
      { nom: 'sl m', age: 22, favoriteFoods: ['Salade', 'pizza'] }
    ];

    Person.create(arrayOfPeople)
      .then(data => {
        console.log('Personnes créées:', data);

        const food = 'Pizza';

        Person.findOne({ favoriteFoods: food })
          .then(personneTrouvee => {
            console.log(`Personne trouvée avec ${food} parmi ses favoris:`, personneTrouvee);

            const personId = personneTrouvee._id;

            personneTrouvee.favoriteFoods.push('panini');

            personneTrouvee.save()
              .then(updatedPerson => {
                console.log('Personne mise à jour:', updatedPerson);

                Person.findOneAndUpdate(
                  { nom: 'SLIMANI' },
                  { age: 20 },
                  { new: true }
                )
                  .then(updatedPerson => {
                    console.log('Personne mise à jour avec nouvel âge:', updatedPerson);

                    Person.findByIdAndRemove(personId)
                      .then(removedPerson => {
                        console.log('Personne supprimée:', removedPerson);

                        Person.deleteOne({ nom: 'sl m' })
                          .then(result => {
                            console.log('Nombre de personnes supprimées:', result.deletedCount);

                            Person.find({ favoriteFoods: 'cheese' })
                              .sort('nom')
                              .limit(2)
                              .select('-age')
                              .exec()
                              .then(data => {
                                console.log('Personnes aimant les cheese:', data);
                                // Terminer l'exécution du script
                                process.exit(0);
                              })
                              .catch(err => {
                                console.error('Erreur lors de la recherche des personnes aimant les cheese:', err);
                                // Terminer l'exécution du script avec une erreur
                                process.exit(1);
                              });
                          })
                          .catch(err => {
                            console.error('Erreur lors de la suppression des personnes avec le nom "Mary":', err);
                            // Terminer l'exécution du script avec une erreur
                            process.exit(1);
                          });
                      })
                      .catch(err => {
                        console.error('Erreur lors de la suppression de la personne par _id:', err);
                        // Terminer l'exécution du script avec une erreur
                        process.exit(1);
                      });
                  })
                  .catch(err => {
                    console.error('Erreur lors de la mise à jour de la personne par nom:', err);
                    // Terminer l'exécution du script avec une erreur
                    process.exit(1);
                  });
              })
              .catch(err => {
                console.error('Erreur lors de la sauvegarde de la personne mise à jour:', err);
                // Terminer l'exécution du script avec une erreur
                process.exit(1);
              });
          })
          .catch(err => {
            console.error('Erreur lors de la recherche de la personne:', err);
            // Terminer l'exécution du script avec une erreur
            process.exit(1);
          });
      })
      .catch(err => {
        console.error('Erreur lors de la création des personnes:', err);
        // Terminer l'exécution du script avec une erreur
        process.exit(1);
      });
  })
  .catch(err => {
    console.error('Erreur lors de l\'enregistrement de la personne:', err);
    // Terminer l'exécution du script avec une erreur
    process.exit(1);
  });
