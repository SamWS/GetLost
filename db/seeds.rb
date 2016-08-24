# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

h = Hobby.new
h.sport = 'Hiking'
h.save

h1 = Hobby.new
h1.sport = 'Camping'
h1.save

h2 = Hobby.new
h2.sport = 'Surfing'
h2.save

h3 = Hobby.new
h3.sport = 'Winter Sports'
h3.save

h4 = Hobby.new
h4.sport = 'Extreme Sports'
h4.save

h5 = Hobby.new
h5.sport = 'Fishing'
h5.save

h6 = Hobby.new
h6.sport = 'Cycling'
h6.save

h7 = Hobby.new
h7.sport = 'Water Sports'
h7.save

h8 = Hobby.new
h8.sport = 'Off-Roading'
h8.save

h9 = Hobby.new
h9.sport = 'Snorking/Scuba'
h9.save

e = Event.new
e.listing = 'Fishing on Yarra River'
e.location = 'Yarra Bend Park'
e.latitude = -37.7941
e.longitude = 145.0104
e.state = 'Victoria'
e.image_url = 'http://www.streamsongresort.com/wp-content/uploads/2014/04/header-bass-fishing.jpg'
e.attendees = 5
e.hobby_id = 6
e.description = 'Looking for fishing enthusiasts to join me on my paddle boat to fish in the Yarra River.  Crikey!'
e.date = '9/1/16'
e.save

e1 = Event.new
e1.listing = 'Off Roading Expedition'
e1.location = 'Yarra Valley'
e1.latitude = -37.6568
e1.longitude = 145.4472
e1.state = 'Victoria'
e1.image_url = 'https://www.google.com.au/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&ved=0ahUKEwijt7TGgdnOAhUDl5QKHTmNDm0QjBwIBA&url=http%3A%2F%2Fblog.chapmanchryslerjeep.com%2Ffiles%2F2013%2F02%2FJeep.jpg&bvm=bv.130731782,d.dGo&psig=AFQjCNHlNGJ3R12UsjY0stV29fyqclRdFw&ust=1472092363034186'
e1.attendees = 3
e1.hobby_id = 9
e1.description = 'Looking to go off roading in my new Jeep!'
e1.date = '10/1/16'
e1.save
