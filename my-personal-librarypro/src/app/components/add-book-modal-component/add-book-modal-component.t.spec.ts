import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddBookModalComponent } from './add-book-modal-component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms'; // Import FormsModule

describe('AddBookModalComponentComponent', () => {
  let component: AddBookModalComponent;
  let fixture: ComponentFixture<AddBookModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, 
        ToastrModule.forRoot(), 
        FormsModule             

      ],
      declarations: [AddBookModalComponent],
      providers: [
        // Provide a mock for NgbActiveModal
        { provide: NgbActiveModal, useValue: jasmine.createSpyObj('NgbActiveModal', ['close', 'dismiss']) }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBookModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
