from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import date


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Deleting existing data...')
        Leaderboard.objects.all().delete()
        Activity.objects.all().delete()
        Team.objects.all().delete()
        User.objects.all().delete()
        Workout.objects.all().delete()

        self.stdout.write('Creating users (superheroes)...')
        users_data = [
            {'username': 'ironman', 'email': 'ironman@marvel.com', 'password': 'avengers123'},
            {'username': 'spiderman', 'email': 'spiderman@marvel.com', 'password': 'webslinger123'},
            {'username': 'thor', 'email': 'thor@marvel.com', 'password': 'mjolnir123'},
            {'username': 'batman', 'email': 'batman@dc.com', 'password': 'darknight123'},
            {'username': 'superman', 'email': 'superman@dc.com', 'password': 'krypton123'},
            {'username': 'wonderwoman', 'email': 'wonderwoman@dc.com', 'password': 'themyscira123'},
        ]
        users = []
        for data in users_data:
            user = User.objects.create(**data)
            users.append(user)
            self.stdout.write(f'  Created user: {user.username}')

        ironman, spiderman, thor, batman, superman, wonderwoman = users

        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(name='Team Marvel')
        team_marvel.members.set([ironman, spiderman, thor])
        team_dc = Team.objects.create(name='Team DC')
        team_dc.members.set([batman, superman, wonderwoman])
        self.stdout.write('  Created Team Marvel and Team DC')

        self.stdout.write('Creating activities...')
        activities_data = [
            {'user': ironman, 'activity_type': 'Flying', 'duration': 45.0, 'date': date(2024, 1, 10)},
            {'user': spiderman, 'activity_type': 'Web Swinging', 'duration': 30.0, 'date': date(2024, 1, 11)},
            {'user': thor, 'activity_type': 'Hammer Throw', 'duration': 60.0, 'date': date(2024, 1, 12)},
            {'user': batman, 'activity_type': 'Batarang Training', 'duration': 50.0, 'date': date(2024, 1, 10)},
            {'user': superman, 'activity_type': 'Laser Vision Practice', 'duration': 40.0, 'date': date(2024, 1, 11)},
            {'user': wonderwoman, 'activity_type': 'Lasso Training', 'duration': 55.0, 'date': date(2024, 1, 12)},
        ]
        for data in activities_data:
            activity = Activity.objects.create(**data)
            self.stdout.write(f'  Created activity: {activity}')

        self.stdout.write('Creating leaderboard entries...')
        leaderboard_data = [
            {'user': ironman, 'score': 950, 'rank': 1},
            {'user': thor, 'score': 900, 'rank': 2},
            {'user': superman, 'score': 880, 'rank': 3},
            {'user': batman, 'score': 860, 'rank': 4},
            {'user': wonderwoman, 'score': 840, 'rank': 5},
            {'user': spiderman, 'score': 800, 'rank': 6},
        ]
        for data in leaderboard_data:
            entry = Leaderboard.objects.create(**data)
            self.stdout.write(f'  Created leaderboard entry: {entry}')

        self.stdout.write('Creating workouts...')
        workouts_data = [
            {
                'name': 'Avengers Strength Training',
                'description': 'High-intensity strength training routine inspired by the Avengers.',
                'exercises': [
                    {'name': 'Iron Man Push-ups', 'sets': 4, 'reps': 20},
                    {'name': 'Thor Deadlifts', 'sets': 3, 'reps': 10},
                    {'name': 'Spider-Man Pull-ups', 'sets': 4, 'reps': 15},
                ],
            },
            {
                'name': 'Justice League Cardio Blast',
                'description': 'Intense cardio session fit for the Justice League.',
                'exercises': [
                    {'name': 'Superman Sprints', 'sets': 5, 'reps': 100, 'unit': 'meters'},
                    {'name': 'Batman Burpees', 'sets': 4, 'reps': 15},
                    {'name': 'Wonder Woman Jump Rope', 'sets': 3, 'duration': '5 minutes'},
                ],
            },
            {
                'name': 'Hero Core Crusher',
                'description': 'Core workout for heroes who need a solid foundation.',
                'exercises': [
                    {'name': 'Plank Hold', 'sets': 3, 'duration': '1 minute'},
                    {'name': 'Captain America Shield Crunch', 'sets': 4, 'reps': 20},
                    {'name': 'Aquaman Flutter Kicks', 'sets': 3, 'reps': 30},
                ],
            },
        ]
        for data in workouts_data:
            workout = Workout.objects.create(**data)
            self.stdout.write(f'  Created workout: {workout.name}')

        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))

