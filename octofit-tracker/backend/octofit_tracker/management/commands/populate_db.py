from django.core.management.base import BaseCommand
from pymongo import MongoClient
from bson.objectid import ObjectId

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data using PyMongo.'

    def handle(self, *args, **kwargs):
        client = MongoClient('localhost', 27017)
        db = client['octofit_db']

        # Drop collections for a clean slate
        db.users.drop()
        db.teams.drop()
        db.activity.drop()
        db.leaderboard.drop()
        db.workouts.drop()

        # Insert test users
        users = [
            {"_id": ObjectId(), "email": "alice@example.com", "name": "Alice", "password": "password1"},
            {"_id": ObjectId(), "email": "bob@example.com", "name": "Bob", "password": "password2"},
            {"_id": ObjectId(), "email": "carol@example.com", "name": "Carol", "password": "password3"}
        ]
        db.users.insert_many(users)

        # Insert test teams
        teams = [
            {"_id": ObjectId(), "name": "Team Octopus", "members": [users[0]["_id"], users[1]["_id"]]},
            {"_id": ObjectId(), "name": "Team Dolphin", "members": [users[2]["_id"]]}
        ]
        db.teams.insert_many(teams)

        # Insert test activities
        activities = [
            {"_id": ObjectId(), "activity_id": "A1", "user": users[0]["_id"], "type": "run", "duration": 30, "date": "2025-05-15"},
            {"_id": ObjectId(), "activity_id": "A2", "user": users[1]["_id"], "type": "walk", "duration": 45, "date": "2025-05-15"},
            {"_id": ObjectId(), "activity_id": "A3", "user": users[2]["_id"], "type": "swim", "duration": 60, "date": "2025-05-15"}
        ]
        db.activity.insert_many(activities)

        # Insert test leaderboard
        leaderboard = [
            {"_id": ObjectId(), "leaderboard_id": "L1", "team": teams[0]["_id"], "points": 150},
            {"_id": ObjectId(), "leaderboard_id": "L2", "team": teams[1]["_id"], "points": 100}
        ]
        db.leaderboard.insert_many(leaderboard)

        # Insert test workouts
        workouts = [
            {"_id": ObjectId(), "workout_id": "W1", "user": users[0]["_id"], "description": "Pushups and situps", "date": "2025-05-15"},
            {"_id": ObjectId(), "workout_id": "W2", "user": users[1]["_id"], "description": "Yoga and stretching", "date": "2025-05-15"},
            {"_id": ObjectId(), "workout_id": "W3", "user": users[2]["_id"], "description": "Swimming laps", "date": "2025-05-15"}
        ]
        db.workouts.insert_many(workouts)

        self.stdout.write(self.style.SUCCESS('Test data populated successfully using PyMongo.'))
