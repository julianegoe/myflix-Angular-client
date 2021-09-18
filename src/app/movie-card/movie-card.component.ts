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

  /**
   * fetches all movies from API
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
        this.movies = resp;
        console.log(this.movies);
        return this.movies;
      });
    }

     /**
   * opens modal to view genre info
   * @param genreName string of genre name
   * @param genreDescription genre description
   */
    openGenreDialog(genreName: string, genreDescription: string): void {
      this.dialog.open(GenreDialogComponent, {
        width: '400px',
        data: {genreName, genreDescription}
      })
    }

     /**
   * opens modal to view director info
   * @param directorName director name
   * @param directorBio director biography
   * @param directorBirth director birthday
   */
    openDirectorDialog(directorName: string, directorBio: string, directorBirth: string): void {
      const directorBirthday = new Date(directorBirth).toISOString().split('T')[0];
      this.dialog.open(DirectorDialogComponent, {
        width: '400px',
        data: {directorName, directorBio, directorBirthday}
      })
    }

     /**
   * opens modal to view synopsis info
   * @param movieDescription synopsis text
   */
    openSynopsisDialog(movieDescription: string): void {
      this.dialog.open(SynopsisDialogComponent, {
        width: '400px',
        data: {movieDescription}
      })
    }

  /**
   * fetches list of favorites
   * @returns array of ids of favorited movies
   */
  getFavs(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
       this.favs = resp.FavoriteMovies
       return this.favs
    })
  }

  /**
   * evaluates if a movie is inside the favorites list
   * @param id 
   * @returns boolean
   */
  isFav(id: string): Boolean {
    return this.favs.includes(id) ? true : false
  }

  /**
   * addes or removies movies from favorites in database and app
   * @param id 
   * @returns updated list of favorites
   */
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
