import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreDialogComponent } from '../genre-dialog/genre-dialog.component';
import { DirectorDialogComponent } from '../director-dialog/director-dialog.component';
import { SynopsisDialogComponent } from '../synopsis-dialog/synopsis-dialog.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = [];
  faved: Boolean = false;
  favs: string[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.getMovies();
    this.getFavs();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
        this.movies = resp;
        console.log(this.movies);
        return this.movies;
      });
    }

    openGenreDialog(genreName: string, genreDescription: string): void {
      this.dialog.open(GenreDialogComponent, {
        width: '400px',
        data: {genreName, genreDescription}
      })
    }

    openDirectorDialog(directorName: string, directorBio: string, directorBirth: string): void {
      const directorBirthday = new Date(directorBirth).toISOString().split('T')[0];
      this.dialog.open(DirectorDialogComponent, {
        width: '400px',
        data: {directorName, directorBio, directorBirthday}
      })
    }

    openSynopsisDialog(movieDescription: string): void {
      this.dialog.open(SynopsisDialogComponent, {
        width: '400px',
        data: {movieDescription}
      })
    }

  getFavs(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
       this.favs = resp.FavoriteMovies
       return this.favs
    })
  }

  isFav(id: string): Boolean {
    return this.favs.includes(id) ? true : false
  }

  toggleFav(id: string): void {
    if (this.isFav(id)) {
      console.log("trying to remove...")
      this.fetchApiData.removeFavorite(id).subscribe((resp: any) => {
        this.snackbar.open('Removed from favorites!', 'OK', {
          duration: 2000,
        });
        return this.favs.splice(this.favs.indexOf(id), 1)
      })
    } else if (!this.isFav(id)) {
      console.log("trying to add...")

      this.fetchApiData.addFavorite(id).subscribe((resp: any) => {
        console.log(id);
        this.snackbar.open('Added to favorites!', 'OK', {
          duration: 2000,
        });
        return this.favs.push(id);
      })
    }
  }
}
