import { Component, OnInit ,ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from './popup/popup.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'apps';
  displayedColumns: string[] = ['title', 'posttype', 'date', 'description','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private popup:MatDialog,private api:ApiService){

  }
  ngOnInit():void{
    this.getAllDetails();
  }
  openPopup(){
    this.popup.open(PopupComponent,{
      width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val == 'Save'){
        this.getAllDetails();
      }
    })
  }
  getAllDetails(){
    this.api.getDetails().subscribe({
      next:(res)=>{
        this.dataSource=new MatTableDataSource(res);
        this.dataSource.paginator= this.paginator;
        this.dataSource.sort=this.sort;
      },
      error:(err)=>{
        alert("Error To Fetch");
      }
    })
  }
  editDetails(row:any){
    this.popup.open(PopupComponent,{
      width:"30%",
      data:row
    }).afterClosed().subscribe(val=>{
      if(val=='Update'){
       this.getAllDetails();
      }
    })
  }
  deleteDetails(id:number){
    this.api.deleteDetails(id).subscribe({
      next:(res)=>{
        alert("Deleted");
        this.getAllDetails();
      },
      error:()=>{
        alert("failed to delete");
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
