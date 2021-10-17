# Interface: WeaponInstance

[server/components/Weapon](../wiki/server.components.Weapon).WeaponInstance

## Hierarchy

- [`ToolInstance`](../wiki/server.components.Tool.ToolInstance)

  ↳ **`WeaponInstance`**

## Table of contents

### Properties

- [AncestryChanged](../wiki/server.components.Weapon.WeaponInstance#ancestrychanged)
- [Archivable](../wiki/server.components.Weapon.WeaponInstance#archivable)
- [AttributeChanged](../wiki/server.components.Weapon.WeaponInstance#attributechanged)
- [BodyAttach](../wiki/server.components.Weapon.WeaponInstance#bodyattach)
- [Changed](../wiki/server.components.Weapon.WeaponInstance#changed)
- [ChildAdded](../wiki/server.components.Weapon.WeaponInstance#childadded)
- [ChildRemoved](../wiki/server.components.Weapon.WeaponInstance#childremoved)
- [ClassName](../wiki/server.components.Weapon.WeaponInstance#classname)
- [DescendantAdded](../wiki/server.components.Weapon.WeaponInstance#descendantadded)
- [DescendantRemoving](../wiki/server.components.Weapon.WeaponInstance#descendantremoving)
- [DmgPart](../wiki/server.components.Weapon.WeaponInstance#dmgpart)
- [Name](../wiki/server.components.Weapon.WeaponInstance#name)
- [Parent](../wiki/server.components.Weapon.WeaponInstance#parent)
- [PrimaryPart](../wiki/server.components.Weapon.WeaponInstance#primarypart)
- [WorldPivot](../wiki/server.components.Weapon.WeaponInstance#worldpivot)

### Methods

- [BreakJoints](../wiki/server.components.Weapon.WeaponInstance#breakjoints)
- [ClearAllChildren](../wiki/server.components.Weapon.WeaponInstance#clearallchildren)
- [Clone](../wiki/server.components.Weapon.WeaponInstance#clone)
- [Destroy](../wiki/server.components.Weapon.WeaponInstance#destroy)
- [FindFirstAncestor](../wiki/server.components.Weapon.WeaponInstance#findfirstancestor)
- [FindFirstAncestorOfClass](../wiki/server.components.Weapon.WeaponInstance#findfirstancestorofclass)
- [FindFirstAncestorWhichIsA](../wiki/server.components.Weapon.WeaponInstance#findfirstancestorwhichisa)
- [FindFirstChild](../wiki/server.components.Weapon.WeaponInstance#findfirstchild)
- [FindFirstChildOfClass](../wiki/server.components.Weapon.WeaponInstance#findfirstchildofclass)
- [FindFirstChildWhichIsA](../wiki/server.components.Weapon.WeaponInstance#findfirstchildwhichisa)
- [FindFirstDescendant](../wiki/server.components.Weapon.WeaponInstance#findfirstdescendant)
- [GetActor](../wiki/server.components.Weapon.WeaponInstance#getactor)
- [GetAttribute](../wiki/server.components.Weapon.WeaponInstance#getattribute)
- [GetAttributeChangedSignal](../wiki/server.components.Weapon.WeaponInstance#getattributechangedsignal)
- [GetAttributes](../wiki/server.components.Weapon.WeaponInstance#getattributes)
- [GetBoundingBox](../wiki/server.components.Weapon.WeaponInstance#getboundingbox)
- [GetChildren](../wiki/server.components.Weapon.WeaponInstance#getchildren)
- [GetDescendants](../wiki/server.components.Weapon.WeaponInstance#getdescendants)
- [GetExtentsSize](../wiki/server.components.Weapon.WeaponInstance#getextentssize)
- [GetFullName](../wiki/server.components.Weapon.WeaponInstance#getfullname)
- [GetModelCFrame](../wiki/server.components.Weapon.WeaponInstance#getmodelcframe)
- [GetModelSize](../wiki/server.components.Weapon.WeaponInstance#getmodelsize)
- [GetPivot](../wiki/server.components.Weapon.WeaponInstance#getpivot)
- [GetPrimaryPartCFrame](../wiki/server.components.Weapon.WeaponInstance#getprimarypartcframe)
- [GetPropertyChangedSignal](../wiki/server.components.Weapon.WeaponInstance#getpropertychangedsignal)
- [IsA](../wiki/server.components.Weapon.WeaponInstance#isa)
- [IsAncestorOf](../wiki/server.components.Weapon.WeaponInstance#isancestorof)
- [IsDescendantOf](../wiki/server.components.Weapon.WeaponInstance#isdescendantof)
- [MakeJoints](../wiki/server.components.Weapon.WeaponInstance#makejoints)
- [MoveTo](../wiki/server.components.Weapon.WeaponInstance#moveto)
- [PivotTo](../wiki/server.components.Weapon.WeaponInstance#pivotto)
- [ResetOrientationToIdentity](../wiki/server.components.Weapon.WeaponInstance#resetorientationtoidentity)
- [SetAttribute](../wiki/server.components.Weapon.WeaponInstance#setattribute)
- [SetIdentityOrientation](../wiki/server.components.Weapon.WeaponInstance#setidentityorientation)
- [SetPrimaryPartCFrame](../wiki/server.components.Weapon.WeaponInstance#setprimarypartcframe)
- [TranslateBy](../wiki/server.components.Weapon.WeaponInstance#translateby)
- [WaitForChild](../wiki/server.components.Weapon.WeaponInstance#waitforchild)

## Properties

### AncestryChanged

• `Readonly` **AncestryChanged**: `RBXScriptSignal`<`fn`\>

Fires when the [Instance.Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) property of the object or one of its ancestors is changed.

This event includes two parameters, _child_ and _parent_. _Child_ refers to the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) whose [Instance.Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) was actually changed. _Parent_ refers to this [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)'s new [Instance.Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent).

A common use for this function is detecting when an object has been removed or destroyed (using [Instance:Destroy](https://developer.roblox.com/en-us/api-reference/function/Instance/Destroy)). This is done by checking if the parent has been set to nil. For example:

object.AncestryChanged:Connect(function(\_, parent)
	if not parent then
		print("object destroyed!")
	end
end)

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[AncestryChanged](../wiki/server.components.Tool.ToolInstance#ancestrychanged)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:936

___

### Archivable

• **Archivable**: `boolean`

This property determines whether an [object](https://developer.roblox.com/en-us/api-reference/class/Instance) should be included when the game is published or saved, or when [Instance:Clone](https://developer.roblox.com/en-us/api-reference/function/Instance/Clone) is called on one of the object's ancestors. Calling Clone directly on an object will return nil if the cloned object is not archivable. Copying an object in Studio (using the 'Duplicate' or 'Copy' options) will ignore the Archivable property and set Archivable to true for the copy.

local part = Instance.new("Part")
print(part:Clone()) --&gt; Part
part.Archivable = false
print(part:Clone()) --&gt; nil

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[Archivable](../wiki/server.components.Tool.ToolInstance#archivable)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:447

___

### AttributeChanged

• `Readonly` **AttributeChanged**: `RBXScriptSignal`<`fn`\>

This event fires whenever an attribute is changed on the instance. This includes when an attribute is set to nil. The name of the attribute that has been changed is passed to the connected function.

For example, the following code snippet will connect the `AttributeChanged` function to fire whenever one of `Instance's` attributes changes. Note that this code sample does not define [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance):

local function attributeChanged(attributeName)
    print(attributeName, “changed”)
end

instance.AttributeChanged:Connect(attributeChanged)

See also
--------

*   [Instance:SetAttribute](https://developer.roblox.com/en-us/api-reference/function/Instance/SetAttribute), sets the attribute with the given name to the given value
*   [Instance:GetAttribute](https://developer.roblox.com/en-us/api-reference/function/Instance/GetAttribute), returns the attribute which has been assigned to the given name
*   [Instance:GetAttributes](https://developer.roblox.com/en-us/api-reference/function/Instance/GetAttributes), returns a dictionary of string → variant pairs for each of the instance's attributes
*   [Instance:GetAttributeChangedSignal](https://developer.roblox.com/en-us/api-reference/function/Instance/GetAttributeChangedSignal), returns an event that fires when the given attribute changes

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[AttributeChanged](../wiki/server.components.Tool.ToolInstance#attributechanged)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:956

___

### BodyAttach

• **BodyAttach**: `BasePart`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[BodyAttach](../wiki/server.components.Tool.ToolInstance#bodyattach)

#### Defined in

src/server/components/Tool.ts:34

___

### Changed

• `Readonly` **Changed**: `unknown`

The Changed event fires right after most properties change on objects. It is possible to find the present value of a changed property by using `object[property]`. To get the value of a property before it changes, you must have stored the value of the property before it changed.

If you are only interested in listening to the change of a specific property, consider using the `GetPropertyChangedSignal` method instead to get an event that only fires when a given property changes.

This event does not fire for physics-related changes, like when the `CFrame`, `Velocity`, `RotVelocity`, `Position`, `Orientation` and `CFrame` properties of a [BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart) change due to gravity. To detect changes in these properties, consider using a physics-based event like `RunService.Stepped` or `BasePart.Touched`. A while-true-do loop can also work.

For “-Value” objects, this event behaves differently: it only fires when the `Value` property changes. See individual pages for [IntValue](https://developer.roblox.com/en-us/api-reference/class/IntValue), [StringValue](https://developer.roblox.com/en-us/api-reference/class/StringValue), etc for more information. To detect other changes in these objects, you must use `GetPropertyChangedSignal` instead.

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[Changed](../wiki/server.components.Tool.ToolInstance#changed)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:966

___

### ChildAdded

• `Readonly` **ChildAdded**: `RBXScriptSignal`<`fn`\>

Fires when an object is parented to this [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance).

Note, when using this function on a client to detect objects created by the server it is necessary to use [Instance:WaitForChild](https://developer.roblox.com/en-us/api-reference/function/Instance/WaitForChild) when indexing these object's descendants. This is because the object and its descendants are not guaranteed to replicate from the server to the client simultaneously. For example:

workspace.ChildAdded:Connect(function(child)
	-- need to use WaitForChild as descendants may not have replicated yet
	local head = child:WaitForChild("Head")
end)

Note, this function only works for immediate children of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance). For a function that captures all descendants, use [Instance.DescendantAdded](https://developer.roblox.com/en-us/api-reference/event/Instance/DescendantAdded).

See also, [Instance.ChildRemoved](https://developer.roblox.com/en-us/api-reference/event/Instance/ChildRemoved).

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[ChildAdded](../wiki/server.components.Tool.ToolInstance#childadded)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:981

___

### ChildRemoved

• `Readonly` **ChildRemoved**: `RBXScriptSignal`<`fn`\>

Fires when a child is removed from this [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance).

Removed refers to when an object's parent is changed from this [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) to something other than this [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance). Note, this event will also fire when a child is destroyed (using [Instance:Destroy](https://developer.roblox.com/en-us/api-reference/function/Instance/Destroy)) as the destroy function sets an object's parent to nil.

This function only works for immediate children of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance). For a function that captures all descendants, use `Instance/DescendantRemoved`.

See also [Instance.ChildAdded](https://developer.roblox.com/en-us/api-reference/event/Instance/ChildAdded).

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[ChildRemoved](../wiki/server.components.Tool.ToolInstance#childremoved)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:991

___

### ClassName

• `Readonly` **ClassName**: `string`

A read-only string representing the class this [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) belongs to.

This property can be used with various other functions of Instance that are used to identify objects by type, such as [Instance:IsA](https://developer.roblox.com/en-us/api-reference/function/Instance/IsA) or [Instance:FindFirstChildOfClass](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstChildOfClass).

Note this property is read only and cannot be altered by scripts. Developers wishing to change an [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)'s class will instead have to create a new [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance).

Unlike [Instance:IsA](https://developer.roblox.com/en-us/api-reference/function/Instance/IsA), ClassName can be used to check if an object belongs to a specific class ignoring class inheritance. For example:

for \_, child in ipairs(game.Workspace:GetChildren()) do
    if child.ClassName == "Part" then
        print("Found a Part")
        -- will find Parts in model, but NOT TrussParts, WedgeParts, etc
    end
end
Tags: ReadOnly, NotReplicated

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[ClassName](../wiki/server.components.Tool.ToolInstance#classname)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:465

___

### DescendantAdded

• `Readonly` **DescendantAdded**: `RBXScriptSignal`<`fn`\>

The DescendantAdded even fires when a descendant is added to the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance).

As DescendantAdded fires for every descendant, parenting an object to the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) will fire the event for this object and all of its descendants individually.

Developers only concerned with the immediate children of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) should use [Instance.ChildAdded](https://developer.roblox.com/en-us/api-reference/event/Instance/ChildAdded) instead.

See also [Instance.DescendantRemoving](https://developer.roblox.com/en-us/api-reference/event/Instance/DescendantRemoving).

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[DescendantAdded](../wiki/server.components.Tool.ToolInstance#descendantadded)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:1001

___

### DescendantRemoving

• `Readonly` **DescendantRemoving**: `RBXScriptSignal`<`fn`\>

DescendantRemoving fires **immediately before** the [Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) of a descendant of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) changes such that the object is no longer a descendant of the Instance. [Destroy](https://developer.roblox.com/en-us/api-reference/function/Instance/Destroy) and [Remove](https://developer.roblox.com/en-us/api-reference/function/Instance/Remove) change an object's Parent to nil, so calling these on a descendant of an object will therefore cause this event to fire.

Since this event fires before the the descendant's removal, the Parent of the descendant will be unchanged, i.e., it will still be a descendant at the time of this event firing. If the descendant is also a child of the object, It will also fire before ChildRemoved. There is no similar event called “DescendantRemoved”.

If a descendant has children, this event fires with the descendant first followed by its descendants.

Example
-------

The example below should help clarify how DescendantRemoving fires when there are several objects involved.

![A cropped screenshot of the Explorer window. A Model contains ModelA and ModelB, which each contain a Part, PartA and PartB respectively. PartA contains a Fire object named FireA.](https://developer.roblox.com/assets/blte4c2d8d1b0fe590c/DescendantRemoving2.png)

*   Calling [Remove](https://developer.roblox.com/en-us/api-reference/function/Instance/Remove) on **PartA** would cause DescendantRemoving to fire on both **ModelA** and **Model**, in that order.
*   Setting the [Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) of **PartA** to **ModelB** would cause DescendantRemoving to fire on **ModelA** but not **Model** (as Model would still be an ancestor of PartA).
*   Calling [Destroy](https://developer.roblox.com/en-us/api-reference/function/Instance/Destroy) on **ModelA** would cause DescendantRemoving to fire multiple times on several objects:
    1.  On **Model** with **ModelA**, **PartA** then **FireA**.
    2.  On **ModelA**, with **PartA** then **FireA**.
    3.  On **PartA** with **FireA**.

Warning
-------

This event fires with the descendant object that is being removed. Attempting to set the [Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) of the descendant being removed to something else **will fail** with the following warning: “Something unexpectedly tried to set the parent of X to Y while trying to set the parent of X. Current parent is Z”, where X is the removing descendant, Y is the ignored parent setting, and Z is the original parent of X. Below is an example that demonstrates this:

workspace.DescendantRemoving:Connect(function(descendant)
	-- Don't manipulate the parent of descendant in this function!
	-- This event fires BECAUSE the parent of descendant was manipulated,
	-- and the change hasn't happened yet, i.e. this function fires before that happens.
	-- Therefore, it is problematic to change the parent like this:
	descendant.Parent = game
end)
local part = Instance.new("Part")
part.Parent = workspace
part.Parent = nil -- This triggers DescendantRemoving on Workspace:
--&gt; Something unexpectedly tried to set the parent of Part to NULL while trying to set the parent of Part. Current parent is Workspace.

See also [DescendantAdded](https://developer.roblox.com/en-us/api-reference/event/Instance/DescendantAdded).

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[DescendantRemoving](../wiki/server.components.Tool.ToolInstance#descendantremoving)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:1042

___

### DmgPart

• **DmgPart**: `BasePart` & { `End`: `Attachment` ; `Start`: `Attachment`  }

#### Defined in

[src/server/components/Weapon.ts:31](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Weapon.ts#L31)

___

### Name

• **Name**: `string`

A non-unique identifier of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance).

This property is an identifier that describes an object. Names are not necessarily unique identifiers however; multiple children of an object may share the same name. Names are used to keep the object hierarchy organized, along with allowing scripts to access specific objects.

The name of an object is often used to access the object through the data model hierarchy using the following methods:

local baseplate = workspace.Baseplate
local baseplate = workspace\["Baseplate"\]
local baseplate = workspace:FindFirstChild("BasePlate")

In order to make an object accessible using the dot operator, an object's Name must follow a certain syntax. The objects name must start with an underscore or letter. The rest of the name can only contain letters, numbers, or underscores (no other special characters). If an objects name does not follow this syntax it will not be accessible using the dot operator and Lua will not interpret its name as an identifier.

If more than one object with the same name are siblings then any attempt to index an object by that name will return the only one of the objects found similar to [Instance:FindFirstChild](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstChild), but not always the desired object. If a specific object needs to be accessed through code, it is recommended to give it a unique name, or guarantee that none of its siblings share the same name as it.

Note, a full name showing the instance's hierarchy can be obtained using [Instance:GetFullName](https://developer.roblox.com/en-us/api-reference/function/Instance/GetFullName).

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[Name](../wiki/server.components.Tool.ToolInstance#name)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:483

___

### Parent

• **Parent**: `undefined` \| `Instance`

The Parent property determines the hierarchical parent of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance). The following terminology is commonly used when talking about how this property is set:

*   An object is a **child** (**parented to**) another object when its Parent is set to that object.
*   The **descendants** of an [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) are the children of that object, plus the descendants of the children as well.
*   The **ancestors** of an [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) are all the objects that the Instance is a descendant of.

It is from this property that many other API members get their name, such as [GetChildren](https://developer.roblox.com/en-us/api-reference/function/Instance/GetChildren) and [FindFirstChild](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstChild).

The [Remove](https://developer.roblox.com/en-us/api-reference/function/Instance/Remove) function sets this property to nil. Calling [Destroy](https://developer.roblox.com/en-us/api-reference/function/Instance/Destroy) will set the Parent of an [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) and all of its descendants to `nil`, and also **lock** the Parent property. An error is raised when setting the Parent of a destroyed object.

This property is also used to manage whether an object exists in the game or needs be be removed. As long as an objects parent is in the [DataModel](https://developer.roblox.com/en-us/api-reference/class/DataModel), is stored in a variable, or is referenced by another objects property, then the object remains in the game. Otherwise, the object will automatically be removed. The top level [DataModel](https://developer.roblox.com/en-us/api-reference/class/DataModel) object (the one referred to as the `game` by scripts) has no parent, but always has a reference held to it by the game engine, and exists for the duration of a session.

Newly created objects using `Instance.new` will not have a parent, and usually will not be visible or function until one is set. The most elementary creation of an object has two steps: creating the object, then setting its parent.

\-- Create a part and parent it to the workspace
local part = Instance.new("Part")
part.Parent = workspace
-- Instance new can also take Parent as a second parameter
Instance.new("NumberValue", workspace)

Object Replication
==================

An object created by server will not replicate to clients until it is parented to some object that is replicated. When creating an object then setting many properties, it's recommended to **set Parent last**. This ensures the object replicates once, instead of replicating many property changes.

local part = Instance.new("Part") -- Avoid using the second parameter here
part.Anchored = true
part.BrickColor = BrickColor.new("Really red")
-- Potentially many other property changes could go here here...
-- Always set parent last!
part.Parent = workspace

However, if you were parenting your parts to a [Model](https://developer.roblox.com/en-us/api-reference/class/Model) whose parent hasn't been set yet, then setting the parent first would not matter as the model would not have replicated yet.
Tags: NotReplicated

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[Parent](../wiki/server.components.Tool.ToolInstance#parent)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:520

___

### PrimaryPart

• **PrimaryPart**: `undefined` \| `BasePart`

Points to the primary part of the [Model](https://developer.roblox.com/en-us/api-reference/class/Model). The primary part is the [BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart) that acts as the physical reference for the pivot of the model. That is, when parts within the model are moved due to physical simulation or other means, the pivot will move in sync with the primary part. If the primary part is **not** set, the pivot will remain at the same location in world space even if parts within the model are moved.

Note that when setting this property, it must be a [BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart) that is a descendant of the model. If you try to set [Model.PrimaryPart](https://developer.roblox.com/en-us/api-reference/property/Model/PrimaryPart) to a [BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart) that is **not** a descendant of the model, it will be set to that part but reset to `nil` during the next simulation step — this is legacy behavior to support scripts which assume they can temporarily set the primary part to a [BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart) which isn't a descendant of the model.

The general rule for models is that:

*   Models whose parts are joined together via physical joints such as [WeldConstraints](https://developer.roblox.com/en-us/api-reference/class/WeldConstraint) or [Motor6Ds](https://developer.roblox.com/en-us/api-reference/class/Motor6D) should have a primary part assigned. For example, Roblox character models have their [Model.PrimaryPart](https://developer.roblox.com/en-us/api-reference/property/Model/PrimaryPart) set to the **HumanoidRootPart** by default.
*   Static (usually [Anchored](https://developer.roblox.com/en-us/api-reference/property/BasePart/Anchored)) models which stay in one place unless a script explicitly moves them don't require a [Model.PrimaryPart](https://developer.roblox.com/en-us/api-reference/property/Model/PrimaryPart) and tend not to benefit from having one set.

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[PrimaryPart](../wiki/server.components.Tool.ToolInstance#primarypart)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:22694

___

### WorldPivot

• **WorldPivot**: `CFrame`

This property determines where the pivot of a [Model](https://developer.roblox.com/en-us/api-reference/class/Model) which does **not** have a set [Model.PrimaryPart](https://developer.roblox.com/en-us/api-reference/property/Model/PrimaryPart) is located. If the [Model](https://developer.roblox.com/en-us/api-reference/class/Model) **does** have a [PrimaryPart](https://developer.roblox.com/en-us/api-reference/property/Model/PrimaryPart), the pivot of the [Model](https://developer.roblox.com/en-us/api-reference/class/Model) is equal to the pivot of that primary part instead, and this [WorldPivot](https://developer.roblox.com/en-us/api-reference/property/Model/WorldPivot) property is ignored.

For a newly created [Model](https://developer.roblox.com/en-us/api-reference/class/Model), its pivot will be treated as the center of the bounding box of its contents until the **first time** its [Model.WorldPivot](https://developer.roblox.com/en-us/api-reference/property/Model/WorldPivot) property is set. Once the world pivot is set for the first time, it is impossible to restore this initial behavior.

Most commonly, moving the model with the Studio tools, or with a model movement function such as [PVInstance:PivotTo](https://developer.roblox.com/en-us/api-reference/function/PVInstance/PivotTo), [Model:MoveTo](https://developer.roblox.com/en-us/api-reference/function/Model/MoveTo), and [Model:SetPrimaryPartCFrame](https://developer.roblox.com/en-us/api-reference/function/Model/SetPrimaryPartCFrame) will set the world pivot and thus end this new model behavior.

The purpose of this behavior is to allow Lua code to get a sensible pivot simply by creating a new model and parenting objects to it, avoiding the need to explicitly set [Model.WorldPivot](https://developer.roblox.com/en-us/api-reference/property/Model/WorldPivot) every time you create a model in code.

local model = Instance.new("Model")
workspace.BluePart.Parent = model
workspace.RedPart.Parent = model
model.Parent = workspace

print(model:GetPivot())  -- Currently equal to the center of the bounding box containing "BluePart" and "RedPart"

model:PivotTo(CFrame.new(0, 10, 0)  -- This works without needing to explicitly set "model.WorldPivot"
Tags: NotReplicated

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[WorldPivot](../wiki/server.components.Tool.ToolInstance#worldpivot)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:22714

## Methods

### BreakJoints

▸ **BreakJoints**(): `void`

Breaks connections between `BaseParts`, including surface connections with any adjacent parts, [WeldConstraint](https://developer.roblox.com/en-us/api-reference/class/WeldConstraint)s, and all [Weld](https://developer.roblox.com/en-us/api-reference/class/Weld)s and other [JointInstance](https://developer.roblox.com/en-us/api-reference/class/JointInstance)s.

When BreakJoints is used on a Player character [Model](https://developer.roblox.com/en-us/api-reference/class/Model), the character's [Humanoid](https://developer.roblox.com/en-us/api-reference/class/Humanoid) will die as it relies on the Neck joint.

Note that although joints produced by surface connections with adjacent Parts can technically be recreated using [Model:MakeJoints](https://developer.roblox.com/en-us/api-reference/function/Model/MakeJoints), this will only recreate joints produced by surfaces. Developers should not rely on this as following the joints being broken parts may no longer be in contact with each other.

#### Returns

`void`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[BreakJoints](../wiki/server.components.Tool.ToolInstance#breakjoints)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:22722

___

### ClearAllChildren

▸ **ClearAllChildren**(): `void`

This function destroys all of an [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)'s children.

As [Instance:Destroy](https://developer.roblox.com/en-us/api-reference/function/Instance/Destroy) also calls itself on the children of an object it is used on, this function will destroy all descendants.

Alternatives to ClearAllChildren
--------------------------------

If the developer does not wish to destroy all descendants, they should use [Instance:GetChildren](https://developer.roblox.com/en-us/api-reference/function/Instance/GetChildren) or [Instance:GetDescendants](https://developer.roblox.com/en-us/api-reference/function/Instance/GetDescendants) to loop through an object and select what to destroy. For example, the following code sample will destroy all parts in an object.

for \_, instance in pairs(object:GetDescendants()) do
	if instance:IsA("BasePart") then
		instance:Destroy()
	end
end

#### Returns

`void`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[ClearAllChildren](../wiki/server.components.Tool.ToolInstance#clearallchildren)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:537

___

### Clone

▸ **Clone**<`T`\>(): `T`

**Clone** creates a copy of an object and all of its descendants, ignoring all objects that are not [Archivable](https://developer.roblox.com/en-us/api-reference/property/Instance/Archivable). The copy of the root object is returned by this function and its [Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) is set to nil.

If a reference property such as [ObjectValue.Value](https://developer.roblox.com/en-us/api-reference/property/ObjectValue/Value) is set in a cloned object, the value of the copy's property depends on original's value:

*   If a reference property refers to an object that was **also** cloned, an _internal reference_, the copy will refer to the copy.
*   If a reference property refers to an object that was **not** cloned, an _external reference_, the same value is maintained in the copy.

This function is typically used to create models that can be regenerated. First, get a reference to the original object. Then, make a copy of the object and insert the copy by setting its [Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) to the [Workspace](https://developer.roblox.com/en-us/api-reference/class/Workspace) or one of its descendants. Finally, when it's time to regenerate the model, [Destroy](https://developer.roblox.com/en-us/api-reference/function/Instance/Destroy) the copy and clone a new one from the original like before.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Instance`<`T`\> |

#### Returns

`T`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[Clone](../wiki/server.components.Tool.ToolInstance#clone)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:548

___

### Destroy

▸ **Destroy**(): `void`

Sets the [Instance.Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) property to nil, locks the [Instance.Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) property, disconnects all connections and calls Destroy on all children. This function is the correct way to dispose of objects that are no longer required. Disposing of unneeded objects is important, since unnecessary objects and connections in a place use up memory (this is called a **memory leak**) which can lead to serious performance issues over time.

**Tip:** After calling Destroy on an object, set any variables referencing the object (or its descendants) to nil. This prevents your code from accessing anything to do with the object.

local part = Instance.new("Part")
part.Name = "Hello, world"
part:Destroy()
-- Don't do this:
print(part.Name) --> "Hello, world"
-- Do this to prevent the above line from working:
part = nil

Once an [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) has been destroyed by this method it cannot be reused because the [Instance.Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) property is locked. To temporarily remove an object, set [Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) it to nil instead. For example:

object.Parent = nil
wait(2)
object.Parent = workspace

To Destroy an object after a set amount of time, use [Debris:AddItem](https://developer.roblox.com/en-us/api-reference/function/Debris/AddItem).

#### Returns

`void`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[Destroy](../wiki/server.components.Tool.ToolInstance#destroy)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:570

___

### FindFirstAncestor

▸ **FindFirstAncestor**(`name`): `undefined` \| `Instance`

Returns the first ancestor of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) whose [Instance.Name](https://developer.roblox.com/en-us/api-reference/property/Instance/Name) is equal to the given name.

This function works upwards, meaning it starts at the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)'s immediate [Instance.Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) and works up towards the [DataModel](https://developer.roblox.com/en-us/api-reference/class/DataModel). If no matching ancestor is found, it returns nil.

The following code snippet would find the first ancestor of the object named 'Car'.

local car = object:FindFirstAncestor("Car")

For variants of this function that find ancestors of a specific class, please see [Instance:FindFirstAncestorOfClass](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstAncestorOfClass) and [Instance:FindFirstAncestorWhichIsA](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstAncestorWhichIsA).

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`undefined` \| `Instance`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[FindFirstAncestor](../wiki/server.components.Tool.ToolInstance#findfirstancestor)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:582

___

### FindFirstAncestorOfClass

▸ **FindFirstAncestorOfClass**<`T`\>(`className`): `undefined` \| `Instances`[`T`]

Returns the first ancestor of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) whose [Instance.ClassName](https://developer.roblox.com/en-us/api-reference/property/Instance/ClassName) is equal to the given className.

This function works upwards, meaning it starts at the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)'s immediate [Instance.Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) and works up towards the [DataModel](https://developer.roblox.com/en-us/api-reference/class/DataModel). If no matching ancestor is found, it returns nil.

A common use of this function is finding the [Model](https://developer.roblox.com/en-us/api-reference/class/Model) a [BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart) belongs to. For example:

local model = part:FindFirstAncestorOfClass("Model")

This function is a variant of [Instance:FindFirstAncestor](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstAncestor) which checks the [Instance.ClassName](https://developer.roblox.com/en-us/api-reference/property/Instance/ClassName) property rather than [Instance.Name](https://developer.roblox.com/en-us/api-reference/property/Instance/Name). [Instance:FindFirstAncestorWhichIsA](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstAncestorWhichIsA) also exists, using the [Instance:IsA](https://developer.roblox.com/en-us/api-reference/function/Instance/IsA) method instead to respect class inheritance.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends keyof `Instances` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `className` | `T` |

#### Returns

`undefined` \| `Instances`[`T`]

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[FindFirstAncestorOfClass](../wiki/server.components.Tool.ToolInstance#findfirstancestorofclass)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:594

___

### FindFirstAncestorWhichIsA

▸ **FindFirstAncestorWhichIsA**<`T`\>(`className`): `undefined` \| `Instances`[`T`]

Returns the first ancestor of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) for whom [Instance:IsA](https://developer.roblox.com/en-us/api-reference/function/Instance/IsA) returns true for the given className.

This function works upwards, meaning it starts at the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)'s immediate [Instance.Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) and works up towards the [DataModel](https://developer.roblox.com/en-us/api-reference/class/DataModel). If no matching ancestor is found, it returns nil.

Unlike [Instance:FindFirstAncestorOfClass](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstAncestorOfClass), this function uses [Instance:IsA](https://developer.roblox.com/en-us/api-reference/function/Instance/IsA) which respects class inheritance. For example:

print(part:IsA("Part")) --&gt; true
print(part:IsA("BasePart")) --&gt; true
print(part:IsA("Instance")) --&gt; true

Therefore, the following code sample will return the first [BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart) ancestor, regardless of if it is a [WedgePart](https://developer.roblox.com/en-us/api-reference/class/WedgePart), [MeshPart](https://developer.roblox.com/en-us/api-reference/class/MeshPart) or [Part](https://developer.roblox.com/en-us/api-reference/class/Part).

local part = object:FindFirstAncestorWhichIsA("BasePart")

See also, [Instance:FindFirstAncestor](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstAncestor).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends keyof `Instances` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `className` | `T` |

#### Returns

`undefined` \| `Instances`[`T`]

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[FindFirstAncestorWhichIsA](../wiki/server.components.Tool.ToolInstance#findfirstancestorwhichisa)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:612

___

### FindFirstChild

▸ **FindFirstChild**(`childName`, `recursive?`): `undefined` \| `Instance`

Returns the first child of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) found with the given name. If no child exists with the given name, this function returns nil. If the optional recursive argument is true, this function searches all descendants rather than only the immediate children of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance). Use this function if your code cannot guarantee the existence of an object with a given name.

Checking the Existence of An Object
-----------------------------------

FindFirstChild is necessary if you need to verify an object something exists before continuing. Attempting to index a child by name using the dot operator throws an error if the child doesn't exist.

 -- The following line errors if Part doesn't exist in the Workspace:
workspace.Part.Transparency = .5

Use FindFirstChild to first check for Part, then use an if-statement to run code that needs it.

local part = workspace:FindFirstChild("Part")
if part then
	part.Transparency = .5
end

Finding a Child Whose Name Matches a Property
---------------------------------------------

Sometimes the [Name](https://developer.roblox.com/en-us/api-reference/property/Instance/Name) of an object is the same as that of a property of its [Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent). When using the dot operator, properties take precedence over children if they share a name.

In the following example, a [Folder](https://developer.roblox.com/en-us/api-reference/class/Folder) called “Color” is added to a [Part](https://developer.roblox.com/en-us/api-reference/class/Part), which also has the `Part/Color` property. `Part.Color` refers to the [Color3](https://developer.roblox.com/en-us/api-reference/datatype/Color3), not the Folder.

local part = Instance.new("Part")
local folder = Instance.new("Folder")
folder.Name = "Color"
folder.Parent = part
local c = part.Color --> A Color3
local c2 = part:FindFirstChild("Color") --> The Folder

A benefit of using FindFirstChild in this way is that the introduction of new properties does not impose a risk on your code.

**Tip:** If you only need to use the result of a FindFirstChild call once, such as getting the property of a child if it exists, you can use the following syntax with the `and` operator:

local myColor = workspace:FindFirstChild("SomePart") and workspace.SomePart.Color

If SomePart exists, `myColor` will contain the Color of SomePart. Otherwise, it'll be nil without throwing an error. This works due to short-circuiting: Lua ignores the right side if the left is nil/false

Performance Note
----------------

FindFirstChild takes about 20% longer than using dot operator, and almost 8 times longer than simply storing a reference to an object. Therefore, you should avoid calling FindFirstChild in performance dependent code, such as in tight loops or functions connected to [RunService.Heartbeat](https://developer.roblox.com/en-us/api-reference/event/RunService/Heartbeat)/[RunService.RenderStepped](https://developer.roblox.com/en-us/api-reference/event/RunService/RenderStepped). **Store the result in a variable,** or consider using [ChildAdded](https://developer.roblox.com/en-us/api-reference/event/Instance/ChildAdded) or [WaitForChild](https://developer.roblox.com/en-us/api-reference/function/Instance/WaitForChild) to detect when a child of a given name becomes available.

#### Parameters

| Name | Type |
| :------ | :------ |
| `childName` | `string` \| `number` |
| `recursive?` | `boolean` |

#### Returns

`undefined` \| `Instance`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[FindFirstChild](../wiki/server.components.Tool.ToolInstance#findfirstchild)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:658

___

### FindFirstChildOfClass

▸ **FindFirstChildOfClass**<`T`\>(`className`): `undefined` \| `Instances`[`T`]

Returns the first child of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) whose [ClassName](https://developer.roblox.com/en-us/api-reference/property/Instance/ClassName) is equal to the given className.

If no matching child is found, this function returns nil.

Unlike [Instance:FindFirstChildWhichIsA](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstChildWhichIsA) this function uses only returns objects whose class matches the given className, ignoring class inheritance.

Developers looking for a child by name, should use [Instance:FindFirstChild](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstChild) instead.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends keyof `Instances` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `className` | `T` |

#### Returns

`undefined` \| `Instances`[`T`]

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[FindFirstChildOfClass](../wiki/server.components.Tool.ToolInstance#findfirstchildofclass)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:668

___

### FindFirstChildWhichIsA

▸ **FindFirstChildWhichIsA**<`T`\>(`className`, `recursive?`): `undefined` \| `Instances`[`T`]

Returns the first child of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) for whom [Instance:IsA](https://developer.roblox.com/en-us/api-reference/function/Instance/IsA) returns true for the given className.

If no matching child is found, this function returns nil. If the optional recursive argument is true, this function searches all descendants rather than only the immediate children of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance).

Unlike [Instance:FindFirstChildOfClass](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstChildOfClass), this function uses [Instance:IsA](https://developer.roblox.com/en-us/api-reference/function/Instance/IsA) which respects class inheritance. For example:

print(part:IsA("Part")) --> true
print(part:IsA("BasePart")) --> true
print(part:IsA("Instance")) --> true

Therefore, the following code sample will return the first [BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart) child, regardless of if it is a [WedgePart](https://developer.roblox.com/en-us/api-reference/class/WedgePart), [MeshPart](https://developer.roblox.com/en-us/api-reference/class/MeshPart) or [Part](https://developer.roblox.com/en-us/api-reference/class/Part).

local part = object:FindFirstChildWhichIsA("BasePart")

Developers looking for a child by name, should use [Instance:FindFirstChild](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstChild) instead.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends keyof `Instances` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `className` | `T` |
| `recursive?` | `boolean` |

#### Returns

`undefined` \| `Instances`[`T`]

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[FindFirstChildWhichIsA](../wiki/server.components.Tool.ToolInstance#findfirstchildwhichisa)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:686

___

### FindFirstDescendant

▸ **FindFirstDescendant**(`name`): `undefined` \| `Instance`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`undefined` \| `Instance`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[FindFirstDescendant](../wiki/server.components.Tool.ToolInstance#findfirstdescendant)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:691

___

### GetActor

▸ **GetActor**(): `Actor`

#### Returns

`Actor`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[GetActor](../wiki/server.components.Tool.ToolInstance#getactor)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:692

___

### GetAttribute

▸ **GetAttribute**(`attribute`): `unknown`

This function returns the attribute which has been assigned to the given name. If no attribute has been assigned then nil is returned.

For example, the following code snippet will set the value of the instance's `InitialPostion` attribute. Note that this code sample does not define [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance):

local initialPosition = instance:GetAttribute("InitialPosition")

See also
========

*   [Instance:SetAttribute](https://developer.roblox.com/en-us/api-reference/function/Instance/SetAttribute), sets the attribute with the given name to the given value
*   [Instance:GetAttributes](https://developer.roblox.com/en-us/api-reference/function/Instance/GetAttributes), returns a dictionary of string → variant pairs for each of the instance's attributes
*   [Instance.AttributeChanged](https://developer.roblox.com/en-us/api-reference/event/Instance/AttributeChanged), fires whenever an attribute is changed on the instance
*   [Instance:GetAttributeChangedSignal](https://developer.roblox.com/en-us/api-reference/function/Instance/GetAttributeChangedSignal), returns an event that fires when the given attribute changes

#### Parameters

| Name | Type |
| :------ | :------ |
| `attribute` | `string` |

#### Returns

`unknown`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[GetAttribute](../wiki/server.components.Tool.ToolInstance#getattribute)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:708

___

### GetAttributeChangedSignal

▸ **GetAttributeChangedSignal**(`attribute`): `RBXScriptSignal`<`Callback`\>

This function returns an event that behaves exactly like the `Changed` event, except that the event only fires when the given attribute changes. It's generally a good idea to use this method instead of a connection to Changed with a function that checks the attribute name. Subsequent calls to this method on the same object with the same attribute name return the same event.

It is similar to [Instance:GetPropertyChangedSignal](https://developer.roblox.com/en-us/api-reference/function/Instance/GetPropertyChangedSignal) but for attributes.

For example, the following code snippet will return a signal that fires the function [Instance.AttributeChanged](https://developer.roblox.com/en-us/api-reference/event/Instance/AttributeChanged) when the instance's `InitialPosition` attribute changes. Note that this code sample does not define [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance):

local function attributeChanged()
    print(“Attribute changed”)
end

instance:GetAttributeChangedSignal("InitialPosition"):Connect(attributeChanged)

See also
========

*   [Instance:SetAttribute](https://developer.roblox.com/en-us/api-reference/function/Instance/SetAttribute), sets the attribute with the given name to the given value
*   [Instance:GetAttribute](https://developer.roblox.com/en-us/api-reference/function/Instance/GetAttribute), returns the attribute which has been assigned to the given name
*   [Instance:GetAttributes](https://developer.roblox.com/en-us/api-reference/function/Instance/GetAttributes), returns a dictionary of string → variant pairs for each of the instance's attributes
*   [Instance.AttributeChanged](https://developer.roblox.com/en-us/api-reference/event/Instance/AttributeChanged), fires whenever an attribute is changed on the instance

#### Parameters

| Name | Type |
| :------ | :------ |
| `attribute` | `string` |

#### Returns

`RBXScriptSignal`<`Callback`\>

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[GetAttributeChangedSignal](../wiki/server.components.Tool.ToolInstance#getattributechangedsignal)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:730

___

### GetAttributes

▸ **GetAttributes**(): `object`

This function returns a dictionary of string → variant pairs for each attribute where the string is the name of the attribute and the variant is a non-nil value.

For example, the following code snippet will print an instance's attributes and values. Note that this code sample does not define [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance):

local attributes = instance:GetAttributes()
for name, value in pairs(attributes) do
    print(name .. “ “ .. value)
end

See also
========

*   [Instance:SetAttribute](https://developer.roblox.com/en-us/api-reference/function/Instance/SetAttribute), sets the attribute with the given name to the given value
*   [Instance:GetAttribute](https://developer.roblox.com/en-us/api-reference/function/Instance/GetAttribute), returns the attribute which has been assigned to the given name
*   [Instance.AttributeChanged](https://developer.roblox.com/en-us/api-reference/event/Instance/AttributeChanged), fires whenever an attribute is changed on the instance
*   [Instance:GetAttributeChangedSignal](https://developer.roblox.com/en-us/api-reference/function/Instance/GetAttributeChangedSignal), returns an event that fires when the given attribute changes

#### Returns

`object`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[GetAttributes](../wiki/server.components.Tool.ToolInstance#getattributes)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:749

___

### GetBoundingBox

▸ **GetBoundingBox**(): `LuaTuple`<[`CFrame`, `Vector3`]\>

This function returns a description of a volume that contains all [BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart) children within a [Model](https://developer.roblox.com/en-us/api-reference/class/Model). The volume's orientation is based on the orientation of the [PrimaryPart](https://developer.roblox.com/en-us/api-reference/property/Model/PrimaryPart), and matches the selection box rendered in Studio when the model is selected. The description is provided in the form of a [CFrame](https://developer.roblox.com/en-us/api-reference/datatype/CFrame) **orientation** and [Vector3](https://developer.roblox.com/en-us/api-reference/datatype/Vector3) **size**.

Mirroring the behavior of [Terrain:FillBlock](https://developer.roblox.com/en-us/api-reference/function/Terrain/FillBlock), it returns a CFrame representing the center of that bounding box and a Vector3 representing its size.

If there is no PrimaryPart for the model, the BoundingBox will be aligned to the world axes.

Example
-------

Pictured below is a [Model](https://developer.roblox.com/en-us/api-reference/class/Model) with a pink semitransparent [Part](https://developer.roblox.com/en-us/api-reference/class/Part) whose [CFrame](https://developer.roblox.com/en-us/api-reference/property/BasePart/CFrame) and [Size](https://developer.roblox.com/en-us/api-reference/property/BasePart/Size) have been set to the return values of this function called on the model.

![A model of an Observation Tower with a pink semitransparent part representing the volume returned by GetBoundingBox](https://developer.roblox.com/assets/blta46b16b68c24f7d7/Model-GetBoundingBox.png)

Usage
-----

local model = workspace.Model
local part = workspace.Part
local orientation, size = model:GetBoundingBox()
part.Size = size
part.CFrame = orientation

#### Returns

`LuaTuple`<[`CFrame`, `Vector3`]\>

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[GetBoundingBox](../wiki/server.components.Tool.ToolInstance#getboundingbox)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:22746

___

### GetChildren

▸ **GetChildren**(): `Instance`[]

Returns an array (a numerically indexed table) containing all of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)'s direct children, or every [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) whose [Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) is equal to the object. The array can be iterated upon using either a numeric or generic for-loop:

\-- Numeric for-loop example
local children = workspace:GetChildren()
for i = 1, #children do
	local child = children\[i\]
	print(child.Name .. " is child number " .. i)
end\-- Generic for-loop example
local children = workspace:GetChildren()
for i, child in ipairs(children) do
	print(child.Name .. " is child number " .. i)
end

The children are sorted by the order in which their [Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) property was set to the object.

See also the [GetDescendants](https://developer.roblox.com/en-us/api-reference/function/Instance/GetDescendants) function.

#### Returns

`Instance`[]

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[GetChildren](../wiki/server.components.Tool.ToolInstance#getchildren)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:768

___

### GetDescendants

▸ **GetDescendants**(): `Instance`[]

The **GetDescendants** function of an object returns an array that contains all of the descendants of that object. Unlike [Instance:GetChildren](https://developer.roblox.com/en-us/api-reference/function/Instance/GetChildren), which only returns the immediate children of an object, GetDescendants will find every child of the object, every child of those children, and so on and so forth.

The arrays returned by GetDescendants are arranged so that parents come earlier than their children. For example, let's look at the following setup:

![Workspace Descendants](https://developer.roblox.com/assets/blt0c3edf2a368c36c8/GetDescendantsExample.png)

Here we have a [Model](https://developer.roblox.com/en-us/api-reference/class/Model) in the [Workspace](https://developer.roblox.com/en-us/api-reference/class/Workspace). Inside this model is three parts (C, D, and E) and another model (InnerModel). Inside the inner model are two more parts (A and B). If we use GetDescendants on the first model and print out the contents of the returned array, we can see that the first level of children, InnerModel, C, D, and E, are printed out before A and B.

local descendants = game.Workspace.Model:GetDescendants()

-- Loop through all of the descendants of the model and
-- print out their name
for index, descendant in pairs(descendants) do
	print(descendant.Name)
end

-- Prints:
-- C
-- D
-- E
-- InnerModel
-- A
-- B
Tags: CustomLuaState

#### Returns

`Instance`[]

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[GetDescendants](../wiki/server.components.Tool.ToolInstance#getdescendants)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:795

___

### GetExtentsSize

▸ **GetExtentsSize**(): `Vector3`

Returns the size of the smallest bounding box that contains all of the [BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart)s in the [Model](https://developer.roblox.com/en-us/api-reference/class/Model). If [Model.PrimaryPart](https://developer.roblox.com/en-us/api-reference/property/Model/PrimaryPart) exists then the bounding box will be aligned to that part. If a primary part has not been set then the function will chose a part in the model to align the bounding box to. As the the selection of this part is not deterministic it is recommended to set a [Model.PrimaryPart](https://developer.roblox.com/en-us/api-reference/property/Model/PrimaryPart) to get consistent results with this function.

Note this function only returns the size of the smallest bounding box, and the developer must employ their own method to obtain the position of the bounding box.

#### Returns

`Vector3`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[GetExtentsSize](../wiki/server.components.Tool.ToolInstance#getextentssize)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:22752

___

### GetFullName

▸ **GetFullName**(): `string`

Returns a string describing the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)'s ancestry. The string is a concatenation of the [Name](https://developer.roblox.com/en-us/api-reference/property/Instance/Name) of the object and its ancestors, separated by periods. The [DataModel](https://developer.roblox.com/en-us/api-reference/class/DataModel) (`game`) is not considered. For example, a [Part](https://developer.roblox.com/en-us/api-reference/class/Part) in the [Workspace](https://developer.roblox.com/en-us/api-reference/class/Workspace) may return `Workspace.Part`.

When called on an [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) that is not a descendant of the [DataModel](https://developer.roblox.com/en-us/api-reference/class/DataModel), this function considers all ancestors up to and including the topmost one without a [Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent).

This function is useful for logging and debugging. You shouldn't attempt to parse the returned string for any useful operation; this function does not escape periods (or any other symbol) in object names. In other words, although its output often appears to be a valid Lua identifier, it is not guaranteed.

#### Returns

`string`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[GetFullName](../wiki/server.components.Tool.ToolInstance#getfullname)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:803

___

### GetModelCFrame

▸ **GetModelCFrame**(): `CFrame`

This value historically returned the CFrame of a central position in the model. It has been deprecated as it did not provide reliable results.
Tags: Deprecated

**`deprecated`**

#### Returns

`CFrame`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[GetModelCFrame](../wiki/server.components.Tool.ToolInstance#getmodelcframe)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:22758

___

### GetModelSize

▸ **GetModelSize**(): `Vector3`

The GetModelSize function returns the `Vector3` size of the [Model](https://developer.roblox.com/en-us/api-reference/class/Model).
Tags: Deprecated

**`deprecated`**

#### Returns

`Vector3`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[GetModelSize](../wiki/server.components.Tool.ToolInstance#getmodelsize)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:22764

___

### GetPivot

▸ **GetPivot**(): `CFrame`

This function gets the pivot of a [PVInstance](https://developer.roblox.com/en-us/api-reference/class/PVInstance). This is often used with [PVInstance:PivotTo](https://developer.roblox.com/en-us/api-reference/function/PVInstance/PivotTo) to move a model.

[Models](https://developer.roblox.com/en-us/api-reference/class/Model) and [BaseParts](https://developer.roblox.com/en-us/api-reference/class/BasePart) are both [PVInstances](https://developer.roblox.com/en-us/api-reference/class/PVInstance) (“Position Velocity Instances”) and so both have this function.

#### Returns

`CFrame`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[GetPivot](../wiki/server.components.Tool.ToolInstance#getpivot)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:20873

___

### GetPrimaryPartCFrame

▸ **GetPrimaryPartCFrame**(): `CFrame`

This function has been superseded by [PVInstance:GetPivot](https://developer.roblox.com/en-us/api-reference/function/PVInstance/GetPivot) which acts as a replacement and does not change your code's behavior. Use [PVInstance:GetPivot](https://developer.roblox.com/en-us/api-reference/function/PVInstance/GetPivot) for new work and migrate your existing [Model:GetPrimaryPartCFrame](https://developer.roblox.com/en-us/api-reference/function/Model/GetPrimaryPartCFrame) calls when convenient.

Returns the `CFrame` of the [Model](https://developer.roblox.com/en-us/api-reference/class/Model)'s [Model.PrimaryPart](https://developer.roblox.com/en-us/api-reference/property/Model/PrimaryPart).

This function is equivalent to the following.

```lua
Model.PrimaryPart.CFrame
```

Note this function will throw an error if no primary part exists for the [Model](https://developer.roblox.com/en-us/api-reference/class/Model). If this behavior is not desired developers can do the following, which will be equal to nil if there is no primary part.

```lua
local cFrame = Model.PrimaryPart and Model.PrimaryPart.CFrame
```

#### Returns

`CFrame`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[GetPrimaryPartCFrame](../wiki/server.components.Tool.ToolInstance#getprimarypartcframe)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:22782

___

### GetPropertyChangedSignal

▸ **GetPropertyChangedSignal**<`T`\>(`propertyName`): `RBXScriptSignal`<`fn`\>

This method returns an event that behaves exactly like the `Changed` event, except that the event only fires when the given property changes. It's generally a good idea to use this method instead of a connection to `Changed` with a function that checks the property name. Subsequent calls to this method on the same object with the same property name return the same event.

`print(object:GetPropertyChangedSignal("Name") == object:GetPropertyChangedSignal("Name")) --&gt; always true`

[ValueBase](https://developer.roblox.com/en-us/api-reference/class/ValueBase) objects, such as [IntValue](https://developer.roblox.com/en-us/api-reference/class/IntValue) and [StringValue](https://developer.roblox.com/en-us/api-reference/class/StringValue), use a modified `Changed` event that fires with the contents of the `Value` property. As such, this method provides a way to detect changes in other properties of those objects. For example, to detect changes in the `Name` property of an [IntValue](https://developer.roblox.com/en-us/api-reference/class/IntValue), use `IntValue:GetPropertyChangedSignal("Name"):Connect(someFunc)` since the `Changed` event of [IntValue](https://developer.roblox.com/en-us/api-reference/class/IntValue) objects only detect changes on the `Value` property.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Instance`<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `propertyName` | `Exclude`<`ExcludeKeys`<`T`, `symbol` \| `Callback` \| `RBXScriptSignal`<`Callback`\>\>, ``"Changed"``\> |

#### Returns

`RBXScriptSignal`<`fn`\>

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[GetPropertyChangedSignal](../wiki/server.components.Tool.ToolInstance#getpropertychangedsignal)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:811

___

### IsA

▸ **IsA**<`T`\>(`className`): this is Instances[T]

IsA returns true if the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)'s class is **equivalent to** or a **subclass** of a given class. This function is similar to the **instanceof** operators in other languages, and is a form of [type introspection](https://en.wikipedia.org/wiki/Type_introspection). To ignore class inheritance, test the [ClassName](https://developer.roblox.com/en-us/api-reference/property/Instance/ClassName) property directly instead. For checking native Lua data types (number, string, etc) use the functions `type` and `typeof`.

Most commonly, this function is used to test if an object is some kind of part, such as [Part](https://developer.roblox.com/en-us/api-reference/class/Part) or [WedgePart](https://developer.roblox.com/en-us/api-reference/class/WedgePart), which inherits from [BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart) (an abstract class). For example, if your goal is to change all of a [Character](https://developer.roblox.com/en-us/api-reference/property/Player/Character)'s limbs to the same color, you might use [GetChildren](https://developer.roblox.com/en-us/api-reference/function/Instance/GetChildren) to iterate over the children, then use IsA to filter non-[BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart) objects which lack the `BrickColor` property:

local function paintFigure(character, color)
	-- Iterate over the child objects of the character
	for \_, child in pairs(character:GetChildren()) do
		-- Filter out non-part objects, such as Shirt, Pants and Humanoid
		-- R15 use MeshPart and R6 use Part, so we use BasePart here to detect both:
		if child:IsA("BasePart") then
			child.BrickColor = color
		end
	end
end
paintFigure(game.Players.Player.Character, BrickColor.new("Bright blue"))

Since all classes inherit from [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance), calling `object:IsA("Instance")` will always return true.
Tags: CustomLuaState

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends keyof `Instances` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `className` | `T` |

#### Returns

this is Instances[T]

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[IsA](../wiki/server.components.Tool.ToolInstance#isa)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:835

___

### IsAncestorOf

▸ **IsAncestorOf**(`descendant`): `boolean`

Returns true if an [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) is an ancestor of the given descendant.

An [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) is considered the ancestor of an object if the object's [Instance.Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) or one of it's parent's [Instance.Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) is set to the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance).

See also, [Instance:IsDescendantOf](https://developer.roblox.com/en-us/api-reference/function/Instance/IsDescendantOf).

#### Parameters

| Name | Type |
| :------ | :------ |
| `descendant` | `Instance` |

#### Returns

`boolean`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[IsAncestorOf](../wiki/server.components.Tool.ToolInstance#isancestorof)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:843

___

### IsDescendantOf

▸ **IsDescendantOf**(`ancestor`): `boolean`

Returns true if an [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) is a descendant of the given ancestor.

An [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) is considered the descendant of an object if the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)'s parent or one of its parent's parent is set to the object.

Note, [DataModel](https://developer.roblox.com/en-us/api-reference/class/DataModel) is a descendant of nil. This means IsDescendantOf cannot be used with a parameter of nil to check if an object has been removed.

See also, [Instance:IsAncestorOf](https://developer.roblox.com/en-us/api-reference/function/Instance/IsAncestorOf).

#### Parameters

| Name | Type |
| :------ | :------ |
| `ancestor` | `Instance` |

#### Returns

`boolean`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[IsDescendantOf](../wiki/server.components.Tool.ToolInstance#isdescendantof)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:853

___

### MakeJoints

▸ **MakeJoints**(): `void`

**Deprecated**

SurfaceType based joining is deprecated, do not use MakeJoints for new projects. [WeldConstraints](https://developer.roblox.com/en-us/api-reference/class/WeldConstraint) and [HingeConstraints](https://developer.roblox.com/en-us/api-reference/class/HingeConstraint) should be used instead

Goes through all [Parts](https://developer.roblox.com/en-us/api-reference/class/BasePart) in the [Model](https://developer.roblox.com/en-us/api-reference/class/Model) and creates joints between the specified Parts and any planar touching surfaces, depending on the parts' surfaces.

*   Smooth surfaces will not create joints
*   Glue surfaces will create a [Glue](https://developer.roblox.com/en-us/api-reference/class/Glue) joint
*   Weld will create a [Weld](https://developer.roblox.com/en-us/api-reference/class/Weld) joint with any surface except for Unjoinable
*   Studs, Inlet, or Universal will each create a [Snap](https://developer.roblox.com/en-us/api-reference/class/Snap) joint with either of other the other two surfaces (e.g. Studs with Inlet and Universal)
*   Hinge and Motor surfaces create [Rotate](https://developer.roblox.com/en-us/api-reference/class/Rotate) and [RotateV](https://developer.roblox.com/en-us/api-reference/class/RotateV) joint instances

This function will not work if the Part is not a descendant of [Workspace](https://developer.roblox.com/en-us/api-reference/class/Workspace). Therefore developers must first ensure the Model is parented to Workspace before using MakeJoints.

#### Returns

`void`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[MakeJoints](../wiki/server.components.Tool.ToolInstance#makejoints)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:22798

___

### MoveTo

▸ **MoveTo**(`position`): `void`

Moves the [Model.PrimaryPart](https://developer.roblox.com/en-us/api-reference/property/Model/PrimaryPart) to the given position. If a primary part has not been specified then the root part of the model will be used. Because the root part is not deterministic, it is recommended to always set a [Model.PrimaryPart](https://developer.roblox.com/en-us/api-reference/property/Model/PrimaryPart) when using MoveTo.

If there are any obstructions where the model is to be moved to, such as [Terrain](https://developer.roblox.com/en-us/api-reference/class/Terrain) or other [BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart)s, then the model will be moved up in the Y direction until there is nothing in the way. If this behavior is not desired, [Model:SetPrimaryPartCFrame](https://developer.roblox.com/en-us/api-reference/function/Model/SetPrimaryPartCFrame) should be used instead.

Note that rotation is not preserved when moving a model with MoveTo. It is recommended to use either [Model:TranslateBy](https://developer.roblox.com/en-us/api-reference/function/Model/TranslateBy) or [Model:SetPrimaryPartCFrame](https://developer.roblox.com/en-us/api-reference/function/Model/SetPrimaryPartCFrame) if the current rotation of the model needs to be preserved.

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | `Vector3` |

#### Returns

`void`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[MoveTo](../wiki/server.components.Tool.ToolInstance#moveto)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:22806

___

### PivotTo

▸ **PivotTo**(`targetCFrame`): `void`

Transforms the [PVInstance](https://developer.roblox.com/en-us/api-reference/class/PVInstance) along with all of its descendant [PVInstances](https://developer.roblox.com/en-us/api-reference/class/PVInstance) such that the pivot is now located at the specified [CFrame](https://developer.roblox.com/en-us/api-reference/datatype/CFrame). This is the primary function that should be used to move [Models](https://developer.roblox.com/en-us/api-reference/class/Model) via scripting.

[BaseParts](https://developer.roblox.com/en-us/api-reference/class/BasePart) are moved in this way by having their [CFrame](https://developer.roblox.com/en-us/api-reference/datatype/CFrame) transformed by the necessary offset. [Models](https://developer.roblox.com/en-us/api-reference/class/Model) are moved in this way by having their [Model.WorldPivot](https://developer.roblox.com/en-us/api-reference/property/Model/WorldPivot) transformed by the necessary offset.

Note that for efficiency purposes, [Instance.Changed](https://developer.roblox.com/en-us/api-reference/event/Instance/Changed) events are not fired for [Position](https://developer.roblox.com/en-us/api-reference/property/BasePart/Position) and [Orientation](https://developer.roblox.com/en-us/api-reference/property/BasePart/Orientation) of [BaseParts](https://developer.roblox.com/en-us/api-reference/class/BasePart) moved in this way; they are only fired for [CFrame](https://developer.roblox.com/en-us/api-reference/datatype/CFrame).

When calling [PivotTo](https://developer.roblox.com/en-us/api-reference/function/PVInstance/PivotTo) on [Models](https://developer.roblox.com/en-us/api-reference/class/Model), the offsets of the descendant parts and models are cached, such that subsequent calls to [PivotTo](https://developer.roblox.com/en-us/api-reference/function/PVInstance/PivotTo) on the same model do not accumulate floating point drift between the parts making up the model.

[Models](https://developer.roblox.com/en-us/api-reference/class/Model) and [BaseParts](https://developer.roblox.com/en-us/api-reference/class/BasePart) are both [PVInstances](https://developer.roblox.com/en-us/api-reference/class/PVInstance) (“Position Velocity Instances”) and so both have this function.

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetCFrame` | `CFrame` |

#### Returns

`void`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[PivotTo](../wiki/server.components.Tool.ToolInstance#pivotto)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:20885

___

### ResetOrientationToIdentity

▸ **ResetOrientationToIdentity**(): `void`

Resets the rotation of the model's parts to the previously set identity rotation, which is done through the [Model:SetIdentityOrientation](https://developer.roblox.com/en-us/api-reference/function/Model/SetIdentityOrientation) method.
Tags: Deprecated

**`deprecated`**

#### Returns

`void`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[ResetOrientationToIdentity](../wiki/server.components.Tool.ToolInstance#resetorientationtoidentity)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:22812

___

### SetAttribute

▸ **SetAttribute**(`attribute`, `value`): `void`

This function sets the attribute with the given name to the given value. If the value given is nil, then the attribute will be removed (since nil is returned by default).

For example, the following code snippet will set the instance's `InitialPosition` attribute to `DataType/Vector3|Vector3.new(0, 0, 0)`. Note that this code sample does not define [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance):

instance:SetAttribute("InitialPosition", Vector3.new(0, 0, 0))

Limitations
===========

Naming requirements and restrictions:

*   Names must only use alphanumeric characters and underscore
*   No spaces or unique symbols are allowed
*   Strings must be 100 characters or less
*   Names are not allowed to start with RBX unless the caller is a Roblox core-script (reserved for Roblox)

When attempting to set an attribute to an unsupported type, an error will be thrown.

See also
========

*   [Instance:GetAttribute](https://developer.roblox.com/en-us/api-reference/function/Instance/GetAttribute), returns the attribute which has been assigned to the given name
*   [Instance:GetAttributes](https://developer.roblox.com/en-us/api-reference/function/Instance/GetAttributes), returns a dictionary of string → variant pairs for each of the instance's attributes
*   [Instance.AttributeChanged](https://developer.roblox.com/en-us/api-reference/event/Instance/AttributeChanged), fires whenever an attribute is changed on the instance
*   [Instance:GetAttributeChangedSignal](https://developer.roblox.com/en-us/api-reference/function/Instance/GetAttributeChangedSignal), returns an event that fires when the given attribute changes

#### Parameters

| Name | Type |
| :------ | :------ |
| `attribute` | `string` |
| `value` | `unknown` |

#### Returns

`void`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[SetAttribute](../wiki/server.components.Tool.ToolInstance#setattribute)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:881

___

### SetIdentityOrientation

▸ **SetIdentityOrientation**(): `void`

Sets the identity rotation of the given model, allowing you to reset the rotation of the entire model later, through the use of the `ResetOrientationToIdentity` method.
Tags: Deprecated

**`deprecated`**

#### Returns

`void`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[SetIdentityOrientation](../wiki/server.components.Tool.ToolInstance#setidentityorientation)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:22818

___

### SetPrimaryPartCFrame

▸ **SetPrimaryPartCFrame**(`cframe`): `void`

This function has been superseded by [PVInstance:PivotTo](https://developer.roblox.com/en-us/api-reference/function/PVInstance/PivotTo) which acts as a more performant replacement and does not change your code's behavior. Use [PVInstance:PivotTo](https://developer.roblox.com/en-us/api-reference/function/PVInstance/PivotTo) for new work and migrate your existing [Model:SetPrimaryPartCFrame](https://developer.roblox.com/en-us/api-reference/function/Model/SetPrimaryPartCFrame) calls when convenient.

Sets the [BasePart.CFrame](https://developer.roblox.com/en-us/api-reference/property/BasePart/CFrame) of the [Model](https://developer.roblox.com/en-us/api-reference/class/Model)'s [Model.PrimaryPart](https://developer.roblox.com/en-us/api-reference/property/Model/PrimaryPart). All other parts in the model will also be moved and will maintain their orientation and offset respective to the [Model.PrimaryPart](https://developer.roblox.com/en-us/api-reference/property/Model/PrimaryPart).

Note, this function will throw an error if no [Model.PrimaryPart](https://developer.roblox.com/en-us/api-reference/property/Model/PrimaryPart) exists for the model. This can cause issues if, for example, the primary part was never set or has been destroyed. Therefore, it is recommended the developer check the [Model.PrimaryPart](https://developer.roblox.com/en-us/api-reference/property/Model/PrimaryPart) exists before using this function. For example:

```lua
if model.PrimaryPart then
    model:SetPrimaryPartCFrame(cf)
end
```

A common use for this is for the 'teleportation' of player characters to different positions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cframe` | `CFrame` |

#### Returns

`void`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[SetPrimaryPartCFrame](../wiki/server.components.Tool.ToolInstance#setprimarypartcframe)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:22834

___

### TranslateBy

▸ **TranslateBy**(`delta`): `void`

Shifts a [Model](https://developer.roblox.com/en-us/api-reference/class/Model) by the given `Vector3` offset, preserving the [Model](https://developer.roblox.com/en-us/api-reference/class/Model)'s orientation. If another [BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart) or [Terrain](https://developer.roblox.com/en-us/api-reference/class/Terrain) already exists at the new position then the [Model](https://developer.roblox.com/en-us/api-reference/class/Model) will overlap said object.

The translation is applied in world space rather than object space, meaning even if the model's parts are orientated differently it will still move along the standard axis.

#### Parameters

| Name | Type |
| :------ | :------ |
| `delta` | `Vector3` |

#### Returns

`void`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[TranslateBy](../wiki/server.components.Tool.ToolInstance#translateby)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:22840

___

### WaitForChild

▸ **WaitForChild**(`childName`): `Instance`

Returns the child of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) with the given name. If the child does not exist, it will yield the current thread until it does.

If the _timeOut_ parameter is specified, this function will return nil and time out after _timeOut_ seconds elapsing without the child being found.

Where should WaitForChild be used?
----------------------------------

WaitForChild is extremely important when working on code ran by the client (in a [LocalScript](https://developer.roblox.com/en-us/api-reference/class/LocalScript)). Roblox does not guarantee the time or order in which objects are replicated from the server to the client. This can cause scripts to break when indexing objects that do not exist yet.

For example, a [LocalScript](https://developer.roblox.com/en-us/api-reference/class/LocalScript) may access a [Model](https://developer.roblox.com/en-us/api-reference/class/Model) in the [Workspace](https://developer.roblox.com/en-us/api-reference/class/Workspace) called 'Ship' like so:

local ship = workspace.Ship
-- Will error if ship hasn't replicated

However if the model 'Ship' has not replicated to the client when this code is ran an error will be returned breaking the [LocalScript](https://developer.roblox.com/en-us/api-reference/class/LocalScript).

Another alternative is using [Instance:FindFirstChild](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstChild). Not only is this good practice when indexing objects in the [DataModel](https://developer.roblox.com/en-us/api-reference/class/DataModel) (as it avoids accidentally accessing properties) but it does not break if the object does not exist. For example:

local ship = workspace:FindFirstChild("Ship")
-- Won't error, but ship will be nil if the ship hasn't replicated

Here, if the model doesn't exist the code will not error. Instead the value ship will be equal to nil. This is better, but still not much good if we want to use the ship model.

Instead WaitForChild should be used:

local ship = workspace:WaitForChild("Ship")
-- Will wait until the ship has replicated before continuing

Here, the thread will be yielded until the ship model has been found. This means the ship model can be used as soon as it is ready.

Notes
-----

*   If a call to this function exceeds 5 seconds without returning, and no _timeOut_ parameter has been specified, a warning will be printed to the output that the thread may yield indefinitely; this warning takes the form `Infinite yield possible on 'X:WaitForChild("Y")'`, where X is the parent name and Y is the child object name.
*   This function does not yield if a child with the given name exists when the call is made.
*   This function is less efficient than [Instance:FindFirstChild](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstChild) or the dot operator. Therefore, it should only be used when the developer is not sure if the object has replicated to the client. Generally this is only the first time the object is accessed
Tags: CustomLuaState, CanYield

#### Parameters

| Name | Type |
| :------ | :------ |
| `childName` | `string` \| `number` |

#### Returns

`Instance`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[WaitForChild](../wiki/server.components.Tool.ToolInstance#waitforchild)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:921

▸ **WaitForChild**(`childName`, `timeOut`): `undefined` \| `Instance`

#### Parameters

| Name | Type |
| :------ | :------ |
| `childName` | `string` \| `number` |
| `timeOut` | `number` |

#### Returns

`undefined` \| `Instance`

#### Inherited from

[ToolInstance](../wiki/server.components.Tool.ToolInstance).[WaitForChild](../wiki/server.components.Tool.ToolInstance#waitforchild)

#### Defined in

node_modules/@rbxts/types/include/generated/None.d.ts:922
