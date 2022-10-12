import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CdkDragDrop} from "@angular/cdk/drag-drop";

import * as uuid from 'uuid';

export class Item {
  name: string;
  uId: string;
  children: Item[];

  constructor(options: {
    name: string,
    children?: Item[]
  }) {
    this.name = options.name;
    this.uId = uuid.v4();
    this.children = options.children || [];
  }
}

@Component({
  selector: 'app-listitem',
  templateUrl: './listitem.component.html',
  styleUrls: ['./listitem.component.scss']
})
export class ListitemComponent implements OnInit {
  @Input() item: Item;
  @Input() parentItem?: Item;
  @Input() public set connectedDropListsIds(ids: string[]) {
    this.allDropListsIds = ids;
  }
  @Output() itemDrop: EventEmitter<CdkDragDrop<Item>>


  ngOnInit() {
  }

  public get connectedDropListsIds(): string[] {
    return this.allDropListsIds.filter((id) => id !== this.item.uId);
  }
  public allDropListsIds: string[];

  public get dragDisabled(): boolean {
    return !this.parentItem;
  }

  public get parentItemId(): string {
    return this.dragDisabled ? '' : this.parentItem.uId;
  }

  constructor() {
    this.allDropListsIds = [];
    this.itemDrop = new EventEmitter();
  }

  public onDragDrop(event: CdkDragDrop<Item, Item>): void {
    this.itemDrop.emit(event);
  }

}

