DROP DATABASE IF EXISTS trailr;

CREATE DATABASE trailr;

USE trailr;

CREATE TABLE users (
  id int AUTO_INCREMENT,
  google_id varchar(255),
  name varchar(255),
  profile_photo_url varchar(255),
  PRIMARY KEY (id)
);

CREATE TABLE trails (
  id int AUTO_INCREMENT,
  api_id int,
  name varchar(255),
  city varchar(50),
  region varchar(50),
  country varchar(50),
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  url varchar(255),
  thumbnail varchar(255),
  description varchar(1500),
  status ENUM('active', 'inactive') NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE photos (
  id int AUTO_INCREMENT,
  url varchar(255),
  description varchar(255),
  lat decimal(10, 8),
  lng decimal(11, 8),
  created_at timestamp,
  id_trail int,
  id_user int,
  PRIMARY KEY (id),
  FOREIGN KEY (id_user) REFERENCES users(id),
  FOREIGN KEY (id_trail) REFERENCES trails(id)
);

CREATE TABLE rating_difficulty (
  id int AUTO_INCREMENT,
  value int,
  id_user int,
  id_trail int,
  PRIMARY KEY (id),
  FOREIGN KEY (id_user) REFERENCES users(id),
  FOREIGN KEY (id_trail) REFERENCES trails(id)
);

CREATE TABLE rating_likeability (
  id int AUTO_INCREMENT,
  value int,
  id_user int,
  id_trail int,
  PRIMARY KEY (id),
  FOREIGN KEY (id_user) REFERENCES users(id),
  FOREIGN KEY (id_trail) REFERENCES trails(id)
);

CREATE TABLE comments (
  id int AUTO_INCREMENT,
  text varchar(140),
  created_at timestamp,
  id_user int,
  id_photo int,
  PRIMARY KEY (id),
  FOREIGN KEY (id_user) REFERENCES users(id),
  FOREIGN KEY (id_photo) REFERENCES photos(id)
);

CREATE TABLE favorites (
  id int AUTO_INCREMENT,
  id_user int,
  id_trail int,
  PRIMARY KEY (id),
  FOREIGN KEY (id_user) REFERENCES users(id),
  FOREIGN KEY (id_trail) REFERENCES trails(id)
);

CREATE TABLE plantId (
  id int AUTO_INCREMENT,
  id_user int,
  id_trail int,
  plant_scientific_name varchar(255),
  plant_common_name varchar(255),
  plant_wiki_url varchar(255),
  plantId_photo varchar(255),
  PRIMARY KEY (id),
  FOREIGN KEY (id_user) REFERENCES users(id),
  FOREIGN KEY (Id_trail) REFERENCES trails(id)
);

INSERT into users (google_id, name, profile_photo_url) VALUES ("100320448870922542711", "Daniel", "https://lh3.googleusercontent.com/a-/AOh14GgCnlLMDczQTYGKy6XfF5EeNsrbDXh4y8j3hLdNvw");
INSERT into users (google_id, name, profile_photo_url) VALUES ("100876014081435780413", "Grant", "https://i.pinimg.com/originals/5c/66/c6/5c66c624f16feab720c601f832b2235e.jpg");
INSERT into users (google_id, name, profile_photo_url) VALUES ("100235682659824703476", "James", "https://avatars1.githubusercontent.com/u/57680469?s=400&u=58ab864ffb55ce45866c75fb05e1f6a8e8c6dfb1&v=4");
INSERT into users (google_id, name, profile_photo_url) VALUES ("100173654872631765438", "Peter", "https://avatars3.githubusercontent.com/u/60944077?s=400&u=d25afe3d4ebcac749237f03a766dc567c4c9d6f0&v=4");


INSERT into trails (api_id, name, url, description, city, region, country, latitude, longitude, thumbnail) VALUES ("276986", "City Park Trail", "https://www.singletracks.com/bike-trails/city-park-trail/", "A short off road trail in what once was the south golf course in City Park.", "New Orleans", "Louisiana", "United States", "29.99931", "-90.08722", "https://images.singletracks.com/blog/wp-content/uploads/2016/12/IMG_20161117_111618485-orig.jpg");
INSERT into trails (api_id, name, url, description, city, region, country, latitude, longitude, thumbnail) VALUES ("375191", "Parc des Familles Trail by NOMAMBO", "https://www.singletracks.com/bike-trails/parc-des-familles-trail-by-nomambo/", "&nbsp;The Estelle Trail is newly cut XC trial located in the old growth swamp of the &nbsp;Parc&nbsp;<em>des Famille</em>&nbsp;property owned by Jefferson Parish. The trail is young and growing, offering beautiful views of untouched cypress swamps on long family-friendly single and doubletrack trails. The trail suits all variety of mountain bikers and hikers of any experience level, from beginners looking for a scenic ride through the woods, to seasoned bikers looking for an aerobic and technical challenge to beat standing best times.\n\nType of Ride:\nThis is a tight and twisty singletrack over dirt that opens to long runs along groomed canals. &nbsp;\n\nLength:\nOne complete loop is approximately 3 miles, with new trail sections being added all the time.\n\nAmenities:\n\nJefferson Parish has created a multifaceted complex. The park includes a sport quadplex comprised of four baseball fields with one field converting into a soccer/football field along with an 18-hole Disc Golf Course. There are batting cages, concessions and press box. The facility includes a boardwalk, nature trails, a pavilion, restrooms and picnic area. &nbsp;\n\nContacts\n\nLocal Club:&nbsp;<a href=\"https://www.mtbproject.com/club/7000169/new-orleans-metro-area-mountain-bike-association\" rel=\"\">New Orleans Metro Area Mountain Bike Association</a>", "Marrero", "Louisiana", "United States", "29.80264", "-90.09063", "https://images.singletracks.com/blog/wp-content/uploads/2020/05/Slide1-375x250.png");
INSERT into trails (api_id, name, url, description, city, region, country, latitude, longitude, thumbnail) VALUES ("287665", "The Tammany Trace", "https://www.singletracks.com/bike-trails/the-tammany-trace/", "This 31-mile asphalted trail and parallel equestrian trail connects five communities--Covington, Abita Springs, Mandeville, Lacombe, and Slidell.\r\nThe Trace also serves as a wildlife conservation corridor, linking isolated parks, creating greenways, and preserving historic landmarks and wetlands. You can observe the natural habitat, bayous, streams and rivers from the vantage point of 31 bridges built on the original railroad trestles.\r\nThis is a truly beautiful trail.\r\n\r\n\r\n", "Mandeville", "Louisiana", "United States", "30.30120", "-89.82637", "https://images.singletracks.com/blog/wp-content/uploads/2018/08/IMG_2498-orig-scaled.jpg");
INSERT into trails (api_id, name, url, description, city, region, country, latitude, longitude, thumbnail) VALUES ("284061", "Fontainebleau State Park", "https://www.singletracks.com/bike-trails/fontainebleau-state-park/", "It's a hiking trail, but I saw bike trail marks on it. And it's compact enough of a surface to do. Not bad for something different. Very easy. Bring insect repellant.", "Mandeville", "Louisiana", "United States", "30.33735", "-90.03733", "https://images.singletracks.com/blog/wp-content/uploads/2018/08/IMG_2642-orig-scaled.jpg");
INSERT into trails (api_id, name, url, description, city, region, country, latitude, longitude, thumbnail) VALUES ("279991", "Northlake Nature Center", "https://www.singletracks.com/bike-trails/south-loop-8660/", "Northlake Nature Center is situated in the heart of St. Tammany Parish, Louisiana, it is also adjacent to Pelican Park Sports Complex and the 31-mile Tammany Trace Rails-to-Trails path. It has 3 main biking and hiking trails. Eagle Trail Loop, South Loop, and North Loop. The Center offers visitors the opportunity to experience three different ecosystems: hardwood forest, pine-hardwood forest and pond-swamp. The ponds in the cypress swamp area are the result of beaver dams and a beaver lodge is visible from one of the centers raised boardwalks.", "Mandeville", "Louisiana", "United States", "30.35141", "-90.03644", "https://images.singletracks.com/blog/wp-content/uploads/2014/06/NNCmap-orig.jpg");
INSERT into trails (api_id, name, url, description, city, region, country, latitude, longitude, thumbnail) VALUES ("279988", "Eagle Trail", "https://www.singletracks.com/bike-trails/eagle-trail-8663/", "Nice easy trail.  Smaller in width than South or North Loop. South side of trail borders the Beaver Pond.", "Mandeville", "Louisiana", "United States", "30.35324", "-90.02715", "https://images.singletracks.com/blog/wp-content/uploads/2014/06/et3-orig.jpg");


INSERT into photos (url, description, lat, lng, id_user, id_trail) VALUES ("https://external-preview.redd.it/MyHXS2zOV9DKDHQ62XGTpECpeeeMCEsV3DLwA6YFlEc.png?format=pjpg&auto=webp&s=190f13f9138872e4314183098ee170b1a0426815", "Sacrificial altar for humans who don't wear masks during pandemics", "30.0044257", "-90.0939056", "2", "1");
INSERT into photos (url, description, lat, lng, id_user, id_trail) VALUES ("https://www.conteches.com/Portals/0/Images/CaseStudies/CityPark_Main.JPG", "Bridge leading into Couterie Forest", "30.0036709", "-90.09498", "4", "1");
INSERT into photos (url, description, lat, lng, id_user, id_trail) VALUES ("https://countryroadsmagazine.com/downloads/3368/download/Tammany-trace-biking.jpg?cb=37106a08236d4173b34d309804c9b56c&w=640", "Why did the sql--squirrel, rather--cross the trail?", "30.4789468", "-90.039199", "4", "3");
INSERT into photos (url, description, lat, lng, id_user, id_trail) VALUES ("https://bridgehunter.com/photos/23/82/238295-M.jpg", "Bayou Lacombe Bridge", "30.3051928", "-89.9255997", "3", "3");
INSERT into photos (url, description, lat, lng, id_user, id_trail) VALUES ("https://3.bp.blogspot.com/_8pLXF3eWByQ/S6wROMdIofI/AAAAAAAAAlk/vXKlFvFWJ4k/s1600/LASlidell2_002TammanyTraceTrail_BayouLaCombeBridge_TraceRangers.jpg", "Lacombie Homies", "30.3052827", "-89.925844", "3", "3");


INSERT into comments (text, id_user, id_photo) VALUES ("To get to the Abita Springs Trailhead Museum", "4", "3");
INSERT into comments (text, id_user, id_photo) VALUES ("Like a bridge over tainted water", "3", "2");
INSERT into comments (text, id_user, id_photo) VALUES ("IN!", "1", "1");
INSERT into comments (text, id_user, id_photo) VALUES ("I'll bring the incense", "4", "1");
INSERT into comments (text, id_user, id_photo) VALUES ("BYOS: Bring Your Own Sacrifice", "2", "1");
INSERT into comments (text, id_user, id_photo) VALUES ("Maybe we should add a way to report comments/photos", "3", "1");
INSERT into comments (text, id_user, id_photo) VALUES ("Looks like good fishing", "1", "5");
INSERT into comments (text, id_user, id_photo) VALUES ("So if they open a drawbridge, is the bridge open, or is the bridge closed?", "2", "5");


INSERT into rating_difficulty (value, id_user, id_trail) VALUES ("3", "2", "1");
INSERT into rating_difficulty (value, id_user, id_trail) VALUES ("2", "1", "1");
INSERT into rating_difficulty (value, id_user, id_trail) VALUES ("5", "3", "1");
INSERT into rating_difficulty (value, id_user, id_trail) VALUES ("3", "2", "2");
INSERT into rating_difficulty (value, id_user, id_trail) VALUES ("4", "1", "3");
INSERT into rating_difficulty (value, id_user, id_trail) VALUES ("5", "2", "3");
INSERT into rating_difficulty (value, id_user, id_trail) VALUES ("5", "3", "3");
INSERT into rating_difficulty (value, id_user, id_trail) VALUES ("5", "4", "3");


INSERT into rating_likeability (value, id_user, id_trail) VALUES ("5", "1", "1");
INSERT into rating_likeability (value, id_user, id_trail) VALUES ("5", "2", "1");
INSERT into rating_likeability (value, id_user, id_trail) VALUES ("5", "3", "1");
INSERT into rating_likeability (value, id_user, id_trail) VALUES ("4", "4", "1");
INSERT into rating_likeability (value, id_user, id_trail) VALUES ("2", "2", "2");
INSERT into rating_likeability (value, id_user, id_trail) VALUES ("3", "2", "3");
INSERT into rating_likeability (value, id_user, id_trail) VALUES ("2", "1", "3");
INSERT into rating_likeability (value, id_user, id_trail) VALUES ("5", "3", "3");


