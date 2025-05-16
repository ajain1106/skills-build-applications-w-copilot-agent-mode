from django.test import TestCase
from .models import User, Team, Activity, Leaderboard, Workout

class UserModelTest(TestCase):
    def test_create_user(self):
        user = User.objects.create(email='test@example.com', name='Test User', password='testpass')
        self.assertEqual(user.email, 'test@example.com')

class TeamModelTest(TestCase):
    def test_create_team(self):
        user = User.objects.create(email='test2@example.com', name='Test User2', password='testpass2')
        team = Team.objects.create(name='Team A')
        team.members.add(user)
        self.assertEqual(team.name, 'Team A')

class ActivityModelTest(TestCase):
    def test_create_activity(self):
        user = User.objects.create(email='test3@example.com', name='Test User3', password='testpass3')
        activity = Activity.objects.create(activity_id='act1', user=user, type='run', duration=30, date='2025-05-16')
        self.assertEqual(activity.type, 'run')

class LeaderboardModelTest(TestCase):
    def test_create_leaderboard(self):
        team = Team.objects.create(name='Team B')
        leaderboard = Leaderboard.objects.create(leaderboard_id='lb1', team=team, points=100)
        self.assertEqual(leaderboard.points, 100)

class WorkoutModelTest(TestCase):
    def test_create_workout(self):
        user = User.objects.create(email='test4@example.com', name='Test User4', password='testpass4')
        workout = Workout.objects.create(workout_id='wo1', user=user, description='Pushups', date='2025-05-16')
        self.assertEqual(workout.description, 'Pushups')
