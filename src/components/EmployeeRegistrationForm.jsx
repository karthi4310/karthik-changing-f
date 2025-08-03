import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import '../styles/EmployeeRegistration.css';

const EmployeeRegistrationForm = ({ isInDashboard = false, editData = null, onClose, onSubmit: onSubmitProp }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState('');


  const totalSteps = 8;

  // Mock data for dropdowns
  const states = [
    { id: 1, name: 'Andhra Pradesh' },
    { id: 2, name: 'Telangana' },
    { id: 3, name: 'Karnataka' },
    { id: 4, name: 'Tamil Nadu' },
    { id: 5, name: 'Kerala' }
  ];

  const districts = [
    { id: 1, name: 'Hyderabad' },
    { id: 2, name: 'Rangareddy' },
    { id: 3, name: 'Medak' },
    { id: 4, name: 'Nizamabad' },
    { id: 5, name: 'Adilabad' }
  ];

  const blocks = [
    { id: 1, name: 'Madhapur' },
    { id: 2, name: 'Gachibowli' },
    { id: 3, name: 'Kondapur' },
    { id: 4, name: 'Hitech City' },
    { id: 5, name: 'Jubilee Hills' }
  ];

  const villages = [
    { id: 1, name: 'Village 1' },
    { id: 2, name: 'Village 2' },
    { id: 3, name: 'Village 3' },
    { id: 4, name: 'Village 4' },
    { id: 5, name: 'Village 5' }
  ];

  const methods = useForm({
    defaultValues: {
      // Step 0 - Personal Details
      salutation: editData?.salutation || '',
      firstName: editData?.firstName || '',
      middleName: editData?.middleName || '',
      lastName: editData?.lastName || '',
      gender: editData?.gender || '',
      nationality: editData?.nationality || '',
      dob: editData?.dob || '',
      photo: editData?.photo || null,

      // Step 1 - Contact Details
      contactNumber: editData?.contactNumber || '',
      email: editData?.email || '',

      // Step 2 - Relation Details
      relationType: editData?.relationType || '',
      relationName: editData?.relationName || '',
      altNumber: editData?.altNumber || '',
      altNumberType: editData?.altNumberType || '',

      // Step 3 - Address Details
      country: editData?.country || '',
      state: editData?.state || '',
      district: editData?.district || '',
      block: editData?.block || '',
      village: editData?.village || '',
      zipcode: editData?.zipcode || '',

      // Step 4 - Professional Details
      professional: {
        education: editData?.professional?.education || '',
        experience: editData?.professional?.experience || ''
      },

      // Step 5 - Bank Details
      bank: {
        bankName: editData?.bank?.bankName || '',
        accountNumber: editData?.bank?.accountNumber || '',
        branchName: editData?.bank?.branchName || '',
        ifscCode: editData?.bank?.ifscCode || '',
        passbook: editData?.bank?.passbook || null
      },

      // Step 6 - Documents
      documentType: editData?.documentType || '',
      voterId: editData?.voterId || '',
      voterFile: editData?.voterFile || null,
      aadharNumber: editData?.aadharNumber || '',
      aadharFile: editData?.aadharFile || null,
      panNumber: editData?.panNumber || '',
      panFile: editData?.panFile || null,
      ppbNumber: editData?.ppbNumber || '',
      ppbFile: editData?.ppbFile || null,

      // Step 7 - Role & Access
      role: editData?.role || '',
      accessStatus: editData?.accessStatus || ''
    }
  });

  const { register, handleSubmit, watch, setValue, trigger, clearErrors, formState: { errors } } = methods;

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
      setValue("photo", file, { shouldValidate: true });
      clearErrors("photo");
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log('Employee form submitted with data:', data);
      
      // Call the onSubmit prop if provided (for dashboard mode)
      if (onSubmitProp) {
        await onSubmitProp(data);
      } else {
        // Default behavior for standalone mode
        if (isInDashboard) {
          onClose && onClose();
        } else {
          navigate('/admin/dashboard');
        }
        alert('Employee registration completed successfully!');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <div className={isInDashboard ? "employee-wrapper dashboard-mode" : "employee-wrapper"}>
      <div className="form-full">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="employee-form">
            {currentStep === 0 && (
              <div className="employeeform-grid">
                {/* 1. Photo */}
                <div className="frame-photo">
                  <label className="label">
                    Photo <span className="optional">(Optional)</span>
                  </label>
                  <div className="photo-box">
                    {photoPreview ? (
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img src={photoPreview} alt="" className="photo-preview" />
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoPreview(null);
                            setValue("photo", null);
                          }}
                          style={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            background: 'rgba(0,0,0,0.5)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: 28,
                            height: 28,
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: 18,
                            lineHeight: '28px',
                            textAlign: 'center',
                            zIndex: 2
                          }}
                          aria-label="Remove photo"
                        >
                          ×
                        </button>
                      </div>
                    ) : editData && editData.photoFileName ? (
                      <img
                        src={`http://localhost:8080/uploads/${editData.photoFileName}`}
                        className="photo-preview"
                        alt=""
                        onError={e => {
                          e.target.style.display = "none";
                          if (e.target.nextSibling) e.target.nextSibling.style.display = "block";
                        }}
                      />
                    ) : (
                      <span className="photo-placeholder">No photo selected</span>
                    )}
                  </div>
                  {/* Show file name if selected or from backend */}
                  <div style={{ marginTop: "6px", fontSize: "0.95em", color: "#444" }}>
                    {photoPreview && watch('photo') && watch('photo')[0] && watch('photo')[0].name
                      ? `Selected: ${watch('photo')[0].name}`
                      : editData && editData.photoFileName
                        ? `Current: ${editData.photoFileName}`
                        : null}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      {...register("photo")}
                      onChange={handlePhotoChange}
                    />
                    {!isInDashboard && errors.photo && <p className="error">{errors.photo.message}</p>}
                  </div>
                </div>

                {/* 5. Last Name */}
                <div>
                  <label className="label">
                    Last Name<span className="required">*</span>
                  </label>
                  <input
                    className="input"
                    placeholder="Last Name"
                    {...register("lastName", { required: "Last Name is required" })}
                  />
                  {!isInDashboard && errors.lastName && <p className="error">{errors.lastName.message}</p>}
                </div>

                {/* 2. Salutation */}
                <div>
                  <label className="label">
                    Salutation<span className="required">*</span>
                  </label>
                  <select
                    className="input"
                    {...register("salutation", { required: "Salutation is required" })}
                  >
                    <option value="">Select</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Miss.">Miss.</option>
                    <option value="Dr.">Dr.</option>
                  </select>
                  {!isInDashboard && errors.salutation && <p className="error">{errors.salutation.message}</p>}
                </div>

                {/* 6. Gender */}
                <div>
                  <label className="label">
                    Gender<span className="required">*</span>
                  </label>
                  <select
                    className="input"
                    {...register("gender", { required: "Gender is required" })}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Transgender</option>
                  </select>
                  {!isInDashboard && errors.gender && <p className="error">{errors.gender.message}</p>}
                </div>

                {/* 3. First Name */}
                <div>
                  <label className="label">
                    First Name<span className="required">*</span>
                  </label>
                  <input
                    className="input"
                    placeholder="First Name"
                    {...register("firstName", { required: "First Name is required" })}
                  />
                  {!isInDashboard && errors.firstName && <p className="error">{errors.firstName.message}</p>}
                </div>

                {/* 8. DOB */}
                <div>
                  <label className="label">
                    DOB<span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    className="input"
                    {...register("dob", { required: "Date of Birth is required" })}
                  />
                  {!isInDashboard && errors.dob && <p className="error">{errors.dob.message}</p>}
                </div>

                {/* 4. Middle Name */}
                <div>
                  <label className="label">
                    Middle Name<span className="required">*</span>
                  </label>
                  <input
                    className="input"
                    placeholder="Middle Name"
                    {...register("middleName", { required: "Middle Name is required" })}
                  />
                  {!isInDashboard && errors.middleName && <p className="error">{errors.middleName.message}</p>}
                </div>

                {/* 7. Nationality */}
                <div>
                  <label className="label">
                    Nationality<span className="required">*</span>
                  </label>
                  <select
                    className="input"
                    {...register("nationality", { required: "Nationality is required" })}
                  >
                    <option value="">Select</option>
                    <option value="Indian">Indian</option>
                  </select>
                  {!isInDashboard && errors.nationality && <p className="error">{errors.nationality.message}</p>}
                </div>
              </div>
            )}

            {/* Step 1: Contact Details */}
            {currentStep === 1 && (
              <div className="emp-form-one">
                <div>
                  <label className="label">Contact Number
                    <span className="required">*</span></label>
                  <input
                    type="text"
                    className="input"
                    {...register("contactNumber", {
                      required: "Contact Number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Enter a valid 10-digit number",
                      },
                    })}
                    placeholder=""
                  />
                  {!isInDashboard && <p className="error">{errors.contactNumber?.message}</p>}
                </div>

                <div>
                  <label className="label"> Email
                    <span className="required">*</span></label>
                  <input
                    type="email"
                    className="input"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Invalid email address",
                      },
                    })}
                    placeholder=""
                  />
                  {!isInDashboard && <p className="error">{errors.email?.message}</p>}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="emp-form-two">
                {/* Relation */}
                <div>
                  <label className="label" htmlFor="relationType">
                    Select <span className="required">*</span>
                  </label>
                  <select
                    id="relationType"
                    className="input"
                    {...register("relationType", { required: "Please select a relation" })}
                  >
                    <option value="">-- Select --</option>
                    <option value="do">D/O</option>
                    <option value="so">S/O</option>
                    <option value="wo">W/O</option>
                  </select>
                  {!isInDashboard && errors.relationType && <p className="error">{errors.relationType.message}</p>}
                </div>

                {/* Relation Name */}
                <div>
                  <label className="label">Relation Name <span className="required">*</span></label>
                  <input
                    type="text"
                    placeholder="Krishna Kumar"
                    className="input"
                    {...register("relationName", { required: "Relation Name is required" })}
                  />
                  {!isInDashboard && errors.relationName && <p className="error">{errors.relationName.message}</p>}
                </div>

                {/* Alternative Number */}
                <div>
                  <label className="label">Alternative Number</label>
                  <input
                    type="text"
                    placeholder="91-987xxxxxx16"
                    className="input"
                    {...register("altNumber", {
                      pattern: {
                        value: /^\d{10}$/,
                        message: "Must be 10 digits",
                      },
                    })}
                  />
                  {!isInDashboard && errors.altNumber && <p className="error">{errors.altNumber.message}</p>}
                </div>

                {/* Alternative Type */}
                <div>
                  <label className="label" htmlFor="altNumberType">
                    Alternative Type <span className="required">*</span>
                  </label>
                  <select
                    id="altNumberType"
                    className="input"
                    {...register("altNumberType", { required: "Please select an alternative type" })}
                  >
                    <option value="">Select Relation</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Other">Other</option>
                  </select>
                  {!isInDashboard && errors.altNumberType && <p className="error">{errors.altNumberType.message}</p>}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="emp-form-three">
                <div>
                  <label className="label">
                    Country <span className="required">*</span>
                  </label>
                  <select
                    className="input"
                    {...register("country", { required: "Country is required" })}
                  >
                    <option value="">Select Country</option>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                  </select>
                  {!isInDashboard && errors.country && (
                    <p className="error">{errors.country?.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">State <span className="required">*</span></label>
                  <select {...register("state")} className="input">
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {!isInDashboard && <p className="error">{errors.state?.message}</p>}
                </div>

                <div>
                  <label className="label">District <span className="required">*</span></label>
                  <select {...register("district")} className="input">
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                  {!isInDashboard && <p className="error">{errors.district?.message}</p>}
                </div>

                <div>
                  <label className="label">Block (mandal) <span className="required">*</span></label>
                  <select {...register("block")} className="input">
                    <option value="">Select Block</option>
                    {blocks.map((block) => (
                      <option key={block.id} value={block.name}>
                        {block.name}
                      </option>
                    ))}
                  </select>
                                     {!isInDashboard && <p className="error">{errors.block?.message}</p>}
                </div>

                <div>
                  <label className="label">Village <span className="required">*</span></label>
                  <select {...register("village")} className="input">
                    <option value="">Select Village</option>
                    {villages.map((village) => (
                      <option key={village.id} value={village.name}>
                        {village.name}
                      </option>
                    ))}
                  </select>
                                     {!isInDashboard && <p className="error">{errors.village?.message}</p>}
                </div>

                <div>
                  <label className="label">Zipcode <span className="required">*</span></label>
                  <input
                    type="text"
                    placeholder="56xxxx"
                    className="input"
                    {...register("zipcode")}
                  />
                                     {!isInDashboard && <p className="error">{errors.zipcode?.message}</p>}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="emp-form-four">
                {/* Education Field */}
                <div>
                  <label className="label">Education <span className="required">*</span></label>
                  <select className="input" {...register("professional.education")}>
                    <option value="">Select</option>
                    <option value="Primary Schooling">Primary Schooling</option>
                    <option value="High School">High School</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Degree">Degree</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Post-Graduate">Post-Graduate</option>
                  </select>
                                     {!isInDashboard && errors.professional?.education && (
                     <p className="error">{errors.education?.message}</p>
                   )}
                </div>

                {/* Experience Field */}
                <div>
                  <label className="label">Experience <span className="required">*</span></label>
                  <input
                    type="text"
                    placeholder="15 Years"
                    className="input"
                    {...register("professional.experience")}
                  />
                                     {!isInDashboard && errors.professional?.experience && (
                     <p className="error">{errors.experience?.message}</p>
                   )}
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="emp-form-five">
                {/* Bank Name */}
                <div>
                  <label className="label">Bank Name <span className="required">*</span></label>
                  <input
                    type="text"
                    placeholder="HDFC Bank"
                    className="input"
                    {...register("bank.bankName")}
                  />
                                     {!isInDashboard && errors.bank?.bankName && <p className="error">{errors.bankName?.message}</p>}
                </div>

                {/* Account Number */}
                <div>
                  <label className="label">Account Number <span className="required">*</span></label>
                  <input
                    type="text"
                    placeholder="281398301653"
                    className="input"
                    {...register("bank.accountNumber")}
                  />
                                     {!isInDashboard && errors.bank?.accountNumber && <p className="error">{errors.accountNumber?.message}</p>}
                </div>

                {/* Branch Name */}
                <div>
                  <label className="label">Branch name <span className="required">*</span></label>
                  <input
                    type="text"
                    placeholder="Madhapur"
                    className="input"
                    {...register("bank.branchName")}
                  />
                                     {!isInDashboard && errors.bank?.branchName && <p className="error">{errors.branchName?.message}</p>}
                </div>

                {/* IFSC Code */}
                <div>
                  <label className="label">IFSC Code <span className="required">*</span></label>
                  <input
                    type="text"
                    placeholder="HDFC0001234"
                    className="input"
                    {...register("bank.ifscCode")}
                  />
                                     {!isInDashboard && errors.bank?.ifscCode && <p className="error">{errors.ifscCode?.message}</p>}
                </div>

                {/* Passbook */}
                <div>
                  <label className="label">Passbook <span className="required">*</span></label>
                  <input
                    type="file"
                    className="input"
                    {...register("bank.passbook")}
                  />
                                     {!isInDashboard && errors.bank?.passbook && <p className="error">{errors.passbook?.message}</p>}
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="emp-form-six">
                <label className="label">
                  Add Document <span className="optional"></span>
                </label>

                <select
                  className="docinput"
                  {...register("documentType", { required: "Document Type is required" })}
                  onChange={(e) => {
                    setSelectedDoc(e.target.value);
                    setValue("documentType", e.target.value);
                  }}
                >
                  <option value="">Select</option>
                  <option value="voterId">ID/ Voter Card</option>
                  <option value="aadharNumber">Aadhar Number</option>
                  <option value="panNumber">Pan Number</option>
                  <option value="ppbNumber">PPB Number</option>
                </select>
                                 {!isInDashboard && <p className="error-text">{errors.documentType?.message}</p>}

                {/* Voter ID */}
                {selectedDoc === "voterId" && (
                  <>
                    <input
                      type="text"
                      placeholder="Voter ID"
                      className="input"
                      {...register("voterId", { required: "Voter ID is required" })}
                    />
                                         {!isInDashboard && <p className="error-text">{errors.voterId?.message}</p>}

                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      {...register("voterFile", { required: "Voter ID File is required" })}
                    />
                                         {!isInDashboard && <p className="error-text">{errors.voterFile?.message}</p>}
                  </>
                )}

                {/* Aadhar */}
                {selectedDoc === "aadharNumber" && (
                  <>
                    <input
                      type="text"
                      placeholder="Aadhar Number"
                      className="input"
                      {...register("aadharNumber", { required: "Aadhar Number is required" })}
                    />
                                         {!isInDashboard && <p className="error-text">{errors.aadharNumber?.message}</p>}

                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      {...register("aadharFile", { required: "Aadhar File is required" })}
                    />
                                         {!isInDashboard && <p className="error-text">{errors.aadharFile?.message}</p>}
                  </>
                )}

                {/* PAN */}
                {selectedDoc === "panNumber" && (
                  <>
                    <input
                      type="text"
                      placeholder="PAN Number"
                      className="input"
                      {...register("panNumber", { required: "PAN Number is required" })}
                    />
                                         {!isInDashboard && <p className="error-text">{errors.panNumber?.message}</p>}

                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      {...register("panFile", { required: "PAN File is required" })}
                    />
                                         {!isInDashboard && <p className="error-text">{errors.panFile?.message}</p>}
                  </>
                )}

                {/* PPB (Optional) */}
                {selectedDoc === "ppbNumber" && (
                  <>
                    <input
                      type="text"
                      placeholder="PPB Number"
                      className="input"
                      {...register("ppbNumber")}
                    />
                                         {!isInDashboard && <p className="error-text">{errors.ppbNumber?.message}</p>}

                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      {...register("ppbFile")}
                    />
                                         {!isInDashboard && <p className="error-text">{errors.ppbFile?.message}</p>}
                  </>
                )}
              </div>
            )}

            {currentStep === 7 && (
              <div className="emp-form-seven">
                <div>
                  <label className="label">
                    Role/Designation <span className="required">*</span>
                  </label>
                  <select className="input" {...register("role", { required: true })}>
                    <option value="">Select</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                  </select>
                                     {!isInDashboard && errors.role && (
                     <p className="error">{errors.role.message}</p>
                   )}
                </div>

                <div>
                  <label className="label">
                    Access <span className="required">*</span>
                  </label>
                  <select className="input" {...register("accessStatus", { required: true })}>
                    <option value="">Select</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                                     {!isInDashboard && errors.accessStatus && (
                     <p className="error">{errors.accessStatus.message}</p>
                   )}
                </div>
              </div>
            )}

            <div className="employee-btn">
              {currentStep === 0 ? (
                <button
                  type="button"
                  onClick={async () => {
                    const isValid = await trigger();
                    if (isValid) setCurrentStep(currentStep + 1);
                  }}
                >
                  Next
                </button>
              ) : currentStep === totalSteps - 1 ? (
                <>
                  <button type="button" onClick={() => setCurrentStep(currentStep - 1)}>
                    Previous
                  </button>
                  <button type="submit">Submit</button>
                </>
              ) : (
                <>
                  <button type="button" onClick={() => setCurrentStep(currentStep - 1)}>
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const isValid = await trigger();
                      if (isValid) setCurrentStep(currentStep + 1);
                    }}
                  >
                    Next
                  </button>
                </>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
      {!isInDashboard && (
        <div className="form-right" style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => {
              if (isInDashboard) {
                // If in admin dashboard, don't navigate away
              } else {
                navigate('/dashboard');
              }
            }}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'rgba(0,0,0,0.45)',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 20,
              lineHeight: '32px',
              textAlign: 'center',
              zIndex: 2
            }}
            aria-label="Close and go back"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeRegistrationForm; 