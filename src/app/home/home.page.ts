import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { LoadingController, ActionSheetController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public feeds: any = [];
  public feedsNoFilter: any = [];
  public hasFilter: boolean = false;
  public filter: string = '';

  constructor(private homeService: HomeService, 
              private loadingController: LoadingController, 
              private inAppBrowser: InAppBrowser, 
              private actionSheetController: ActionSheetController) {

    this.loadContent();
  }

  async loadContent () {
    let loading = await this.loadingController.create({
      message: 'Please Wait ...',
      spinner: 'crescent',
      duration: 2000
    });

    await loading.present();

    this.homeService.getFeeds()
    .pipe(map(res => res.data.children))
    .subscribe(data => {
      console.log(data);
      this.feeds = data;
      this.feedsNoFilter = data;
      this.adjustImages();
      loading.dismiss();
    });
  }

  showItemSelected(url: string) {
    let browser = this.inAppBrowser.create(url);
  }

  doRefresh(event) {
    let name = this.feeds[0].data.name;

    this.homeService.getNewFeeds(name)
    .pipe(map(res => res.data.children))
    .subscribe(data => {
      this.feeds = data.concat(this.feeds);
      this.adjustImages();
      event.target.complete();
      this.feedsNoFilter = this.feeds;
      this.hasFilter = false;
    });
  }

  doInfinite(event) {
    let name = (this.feeds.length > 0) ? this.feeds[this.feeds.length - 1].data.name : "";

    this.homeService.getOldFeeds(name)
    .pipe(map(res => res.data.children))
    .subscribe(data => {
      this.feeds = this.feeds.concat(data);
      this.adjustImages();
      event.target.complete();
      this.feedsNoFilter = this.feeds;
      this.hasFilter = false;
    }); 
  }

  async showFilters() {
    let actionSheet = await this.actionSheetController.create({
      header: 'Filter options:',
      buttons: [
        {
          text: 'Music',
          handler: () => {
            this.feeds = this.feedsNoFilter.filter((item) => item.data.subreddit.toLowerCase().includes("music"));
            this.hasFilter = true;
          }
        },
        {
          text: 'Movies',
          handler: () => {
            this.feeds = this.feedsNoFilter.filter((item) => item.data.subreddit.toLowerCase().includes("movies"));
            this.hasFilter = true;
          }
        },
        {
          text: 'Games',
          handler: () => {
            this.feeds = this.feedsNoFilter.filter((item) => item.data.subreddit.toLowerCase().includes("gaming"));
            this.hasFilter = true;
          }
        },
        {
          text: 'Pictures',
          handler: () => {
            this.feeds = this.feedsNoFilter.filter((item) => item.data.subreddit.toLowerCase().includes("pics"));
            this.hasFilter = true;
          }
        },                
        {
          text: 'Ask Reddit',
          handler: () => {
            this.feeds = this.feedsNoFilter.filter((item) => item.data.subreddit.toLowerCase().includes("askreddit"));
            this.hasFilter = true;
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.feeds = this.feedsNoFilter;
            this.hasFilter = false;
          }
        }
      ]
    });

    await actionSheet.present();
  }

  filterItems() {
    this.feeds = this.feedsNoFilter.filter((item) => item.data.title.toLowerCase().includes(this.filter.toLowerCase()));
    this.hasFilter = false;
  }

  adjustImages() {
    this.feeds.forEach((e, i, a) => {
      if(!e.data.thumbnail || e.data.thumbnail.indexOf('b.thumbs.redditmedia.com') === -1 ) {
        e.data.thumbnail = 'https://www.redditstatic.com/icon.png';
      }
    });
  }
}
